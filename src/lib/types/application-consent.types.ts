export interface ApplicationConsent {
    applicationGrants: ApplicationGrant[]
    applicationId: string
}

export interface ApplicationGrant {
    scope: string
    enterpriseApplicationId: string
}
