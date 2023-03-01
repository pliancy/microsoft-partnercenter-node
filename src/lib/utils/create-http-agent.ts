import axios, { AxiosInstance } from 'axios'
import qs from 'querystring'
import { IOAuthResponse, IPartnerCenterConfig } from '../types/common.types'

let accessToken = ''

export function createHttpAgent(config: IPartnerCenterConfig): AxiosInstance {
    const baseURL = 'https://api.partnercenter.microsoft.com/v1/'
    const agent = axios.create({ baseURL })

    agent.interceptors.request.use(async (req) => {
        if (!accessToken) {
            accessToken = await authenticate(config)
        }
        req.headers.authorization = `Bearer ${accessToken}`
        return req
    })
    return agent
}

const authenticate = async (config: IPartnerCenterConfig): Promise<string> => {
    const res = await axios.post(
        `https://login.windows.net/${config.partnerDomain}/oauth2/token`,
        qs.stringify({
            grant_type: 'client_credentials',
            resource: 'https://graph.windows.net',
            client_id: config.authentication.clientId,
            client_secret: config.authentication.clientSecret,
        }),
        {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        },
    )
    const body: IOAuthResponse = res.data
    return body?.access_token ?? ''
}
