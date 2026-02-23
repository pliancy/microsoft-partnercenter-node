export interface ServicePrincipal {
    id: string
    deletedDateTime?: Date
    accountEnabled: true
    alternativeNames: string[]
    appDisplayName: string
    appDescription?: string
    appId: string
    applicationTemplateId?: string
    appOwnerOrganizationId: string
    appRoleAssignmentRequired: false
    createdByAppId?: string
    createdDateTime: string
    description?: string
    disabledByMicrosoftStatus?: string
    displayName: string
    homepage?: string
    loginUrl?: string
    logoutUrl?: string
    notes?: string
    notificationEmailAddresses: []
    preferredSingleSignOnMode?: string
    preferredTokenSigningKeyThumbprint?: string
    replyUrls: string[]
    servicePrincipalNames: string[]
    servicePrincipalType: string
    signInAudience: string
    tags: string[]
    tokenEncryptionKeyId?: string
    samlSingleSignOnSettings?: SamlSingleSignOnSettings
    addIns: string[]
    appRoles: AppRole[]
    info: {
        logoUrl?: string
        marketingUrl?: string
        privacyStatementUrl?: string
        supportUrl?: string
        termsOfServiceUrl?: string
    }
    keyCredentials: string[]
    oauth2PermissionScopes: string[]
    passwordCredentials: string[]
    resourceSpecificApplicationPermissions: string[]
    verifiedPublisher: {
        displayName?: string
        verifiedPublisherId?: string
        addedDateTime?: string
    }
}

export interface AppRole {
    id: string
    allowedMemberTypes: ('User' | 'Application')[]
    description: string
    displayName: string
    isEnabled: boolean
    value: string
}

export interface SamlSingleSignOnSettings {
    baseUrl?: string
}

export interface AppRoleAssignment {
    id: string
    appRoleId: string
    resourceId: string
}
