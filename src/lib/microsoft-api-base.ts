import { AxiosInstance } from 'axios'
import { TokenManager, initializeHttpAndTokenManager } from './utils/http-token-manager'
import { GraphApiConfig, IPartnerCenterConfig } from './types'

export abstract class MicrosoftApiBase {
    protected readonly httpAgent: AxiosInstance
    protected readonly tokenManager: TokenManager

    constructor(
        config: IPartnerCenterConfig | GraphApiConfig,
        baseURL: string,
        scope: string,
        private readonly oAuthVersion?: 'v1' | 'v2',
    ) {
        const { agent, tokenManager } = initializeHttpAndTokenManager(
            config,
            baseURL,
            scope,
            oAuthVersion,
        )
        this.httpAgent = agent
        this.tokenManager = tokenManager
    }

    async getRefreshToken() {
        return this.tokenManager.getInitializedRefreshToken()
    }
}
