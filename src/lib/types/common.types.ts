export interface IPartnerCenterConfig {
    /** partner center primary domain for your partner account */
    partnerDomain: string
    authentication: ClientAuth
    /** timeout threshold in milliseconds */
    timeoutMs?: number
    conflict?: {
        /** if true, the library will retry the request after a 409 conflict */
        retryOnConflict: boolean
        /** The time to delay retry in milliseconds  */
        retryOnConflictDelayMs?: number
        /** The maximum number of retries */
        maximumRetries?: number
    }
    /**
     * Callback function to update the refresh token in your database
     */
    onUpdateRefreshToken?: (newRefreshToken: string) => void
}
export interface ClientAuth {
    clientId: string
    clientSecret: string
    refreshToken?: string
}

export interface IOAuthResponse {
    token_type: string
    expires_in: string
    ext_expires_in: string
    expires_on: string
    not_before: string
    resource: string
    access_token: string
    refresh_token?: string
}

export interface LinksBase {
    self: Link
}

export interface Link {
    uri: string
    method: Method
    headers: any[]
}

export enum Method {
    Get = 'GET',
    Post = 'POST',
    Patch = 'PATCH',
    Delete = 'DELETE',
    Put = 'PUT',
}

export type BillingPlan = 'P1M' | 'P1Y' | 'P3Y'
