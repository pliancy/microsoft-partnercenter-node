import axios, { AxiosRequestConfig } from 'axios'
import qs from 'querystring'
import { decode, JwtPayload } from 'jsonwebtoken'
import { IOAuthResponse, IPartnerCenterConfig } from '../types/common.types'

export class TokenManager {
    private accessToken = ''
    private _refreshToken = ''
    private reAuthed = false
    private retry = 0
    private scope: string

    constructor(
        private config: IPartnerCenterConfig,
        scope: string,
    ) {
        this.scope = scope
    }

    async getInitializedRefreshToken() {
        if (!this.config.authentication.refreshToken) {
            return null
        }

        if (!this._refreshToken) {
            await this.authenticate()
        }

        return this._refreshToken
    }

    async getAccessToken() {
        if (!this.accessToken || this.isTokenExpired()) {
            await this.authenticate()
        }
        return this.accessToken
    }

    async handleAuthenticationError(err: any, requestConfig: AxiosRequestConfig) {
        const maxRetries = this.config.conflict?.maximumRetries ?? 3
        const retryAfter = this.config.conflict?.retryOnConflictDelayMs ?? 1000

        if (err.response?.status === 401 && !this.reAuthed) {
            this.reAuthed = true
            await this.authenticate()
            requestConfig.headers = requestConfig.headers || {}
            requestConfig.headers.authorization = `Bearer ${this.accessToken}`
            return axios(requestConfig)
        } else if (
            err.response?.status === 409 &&
            this.config?.conflict?.retryOnConflict &&
            this.retry < maxRetries
        ) {
            this.retry++
            await new Promise((resolve) => setTimeout(resolve, retryAfter))
            return axios(requestConfig)
        }

        this.retry = 0
        this.reAuthed = false
        throw err
    }

    private async authenticate() {
        let authData = this.prepareAuthData()

        try {
            const res = await axios.post(
                `https://login.microsoftonline.com/${this.config.partnerDomain}/oauth2/token`,
                authData,
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                },
            )

            const body: IOAuthResponse = res.data
            this.accessToken = body.access_token

            if (body.refresh_token) {
                this.config.authentication.refreshToken = body.refresh_token
                this._refreshToken = body.refresh_token
            }
        } catch (error) {
            throw new Error('Failed to authenticate with the Microsoft Partner Center.')
        }
    }

    private prepareAuthData() {
        if (this.config.authentication.refreshToken) {
            return qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: this.config.authentication.refreshToken,
                client_id: this.config.authentication.clientId,
                client_secret: this.config.authentication.clientSecret,
                scope: this.scope,
            })
        }
        return qs.stringify({
            grant_type: 'client_credentials',
            client_id: this.config.authentication.clientId,
            client_secret: this.config.authentication.clientSecret,
            scope: this.scope,
        })
    }
    private isTokenExpired() {
        if (!this.accessToken) {
            return true // If there's no token, it's considered expired
        }

        try {
            const decodedToken = (decode(this.accessToken) as JwtPayload) || null
            if (!decodedToken || !decodedToken.exp) {
                return true
            }

            const currentUnixTime = Math.floor(Date.now() / 1000)
            // Check if the token has expired
            return decodedToken.exp < currentUnixTime
        } catch (error) {
            return true
        }
    }
}

export function initializeHttpAndTokenManager(
    config: IPartnerCenterConfig,
    baseURL: string,
    scope: string,
) {
    const tokenManager = new TokenManager(config, scope)
    const agent = axios.create({ baseURL, timeout: config.timeoutMs })

    agent.interceptors.request.use(async (req) => {
        req.headers.authorization = `Bearer ${await tokenManager.getAccessToken()}`
        return req
    })

    agent.interceptors.response.use(
        (res) => res,
        async (err) => tokenManager.handleAuthenticationError(err, err.config),
    )

    return {
        agent,
        tokenManager,
    }
}
