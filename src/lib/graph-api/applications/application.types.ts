export interface RequiredResourceAccess {
    resourceAppId: string
    resourceAccess: {
        id: string
        type: 'Scope' | 'Role'
    }[]
}

export interface AppRole {
    role: string // E.g., Microsoft Exchange
    permissions: AppPermission[]
}

export interface AppPermission {
    name: string // E.g. Mail.Read
    type: 'Application' | 'Delegated'
}

export interface AppServicePrincipal {
    id: string
    adminConsentDescription: string
    adminConsentDisplayName: string
    isEnabled: boolean
    type: string
    userConsentDescription: string
    userConsentDisplayName: string
    value: string
    displayName?: string
    appRoles?: AppServicePrincipal[]
    oauth2PermissionScopes?: AppServicePrincipal[]
}

export interface GraphApplication {
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#applications/$entity'
    id: string
    deletedDateTime?: string
    appId: string
    applicationTemplateId: string
    disabledByMicrosoftStatus: string
    createdDateTime: string
    displayName: string
    description: string
    groupMembershipClaims: string
    identifierUris: string[]
    isDeviceOnlyAuthSupported: string
    isFallbackPublicClient: string
    nativeAuthenticationApisEnabled: string
    notes: string
    publisherDomain: string
    serviceManagementReference: string
    signInAudience: string
    tags: string[]
    tokenEncryptionKeyId: string
    uniqueName: string
    samlMetadataUrl: string
    defaultRedirectUri: string
    certification: string
    optionalClaims: string
    requestSignatureVerification: string
    addIns: string[]
    api: {
        acceptMappedClaims: string
        knownClientApplications: string[]
        requestedAccessTokenVersion: string
        oauth2PermissionScopes: string[]
        preAuthorizedApplications: string[]
    }
    appRoles: string[]
    info: {
        logoUrl: string
        marketingUrl: string
        privacyStatementUrl: string
        supportUrl: string
        termsOfServiceUrl: null
    }
    keyCredentials: {
        customKeyIdentifier: string
        displayName: string
        endDateTime: string
        key: string
        keyId: string
        startDateTime: string
        type: string
        usage: string
    }[]
    parentalControlSettings: { countriesBlockedForMinors: string[]; legalAgeGroupRule: string }
    passwordCredentials: {
        customKeyIdentifier: string
        displayName: string
        endDateTime: string
        hint: string
        keyId: string
        secretText: string
        startDateTime: string
    }[]
    publicClient: { redirectUris: string[] }
    requiredResourceAccess: RequiredResourceAccess[]
    verifiedPublisher: { displayName: string; verifiedPublisherId: string; addedDateTime: null }
    web: {
        homePageUrl: string
        logoutUrl: string
        redirectUris: string[]
        implicitGrantSettings: { enableAccessTokenIssuance: false; enableIdTokenIssuance: false }
        redirectUriSettings: { uri: string; index: number | null }[]
    }
    servicePrincipalLockConfiguration: {
        isEnabled: true
        allProperties: true
        credentialsWithUsageVerify: true
        credentialsWithUsageSign: true
        identifierUris: false
        tokenEncryptionKeyId: true
    }
    spa: { redirectUris: string[] }
}
