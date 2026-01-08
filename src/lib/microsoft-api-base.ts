import { AxiosInstance } from 'axios'
import { TokenManager, initializeHttpAndTokenManager } from './utils/http-token-manager'
import { GraphApiConfig, IPartnerCenterConfig } from './types'

export abstract class MicrosoftApiBase {
    protected readonly httpAgent: AxiosInstance
    protected readonly tokenManager: TokenManager

    protected constructor(
        config: IPartnerCenterConfig | GraphApiConfig,
        baseURL: string,
        scope: string,
    ) {
        const { agent, tokenManager } = initializeHttpAndTokenManager(config, baseURL, scope)
        this.httpAgent = agent
        this.tokenManager = tokenManager
    }

    async getRefreshToken() {
        return this.tokenManager.getInitializedRefreshToken()
    }
}
