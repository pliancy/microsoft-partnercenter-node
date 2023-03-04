export interface IPartnerCenterConfig {
    /** partner center primary domain for your partner account */
    partnerDomain: string
    authentication: ClientAuth
    /** timeout threshold in milliseconds */
    timeoutMs?: number
    conflict?: {
        /** if true, the library will retry the request after a 409 conflict */
        retryOnConflict: boolean
        /** if true, the library will retry the request after a 409 conflict */
        retryOnConflictDelayMs: number
        maximumRetries?: number
    }
}
export interface ClientAuth {
    clientId: string
    clientSecret: string
}

export interface IOAuthResponse {
    token_type: string
    expires_in: string
    ext_expires_in: string
    expires_on: string
    not_before: string
    resource: string
    access_token: string
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
