import axios, { AxiosRequestConfig } from 'axios'
import qs from 'querystring'
import { IOAuthResponse, IPartnerCenterConfig } from '../types/common.types'

export class TokenManager {
    private accessToken = ''
    private _refreshToken = ''
    private reAuthed = false
    private retry = 0

    constructor(private config: IPartnerCenterConfig) {}

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
        if (!this.accessToken) {
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
                scope: 'https://api.partnercenter.microsoft.com/.default',
            })
        }
        return qs.stringify({
            grant_type: 'client_credentials',
            resource: 'https://graph.windows.net',
            client_id: this.config.authentication.clientId,
            client_secret: this.config.authentication.clientSecret,
        })
    }

    private isTokenExpired() {
        // TODO: Implement token expiration check
        return false
    }
}

export function initializeHttpAndTokenManager(config: IPartnerCenterConfig) {
    const baseURL = 'https://api.partnercenter.microsoft.com/v1/'
    const tokenManager = new TokenManager(config)
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
