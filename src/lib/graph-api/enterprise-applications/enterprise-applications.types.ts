export interface ServicePrincipal {
    id: string // The unique UUID for the service principal object in the directory
    appId: string // The unique identifier for the associated application
    displayName: string

    // Identifiers
    appDisplayName?: string
    appDescription?: string
    servicePrincipalNames: string[]
    replyUrls: string[]

    // Enterprise App Specifics
    accountEnabled: boolean
    alternativeNames: string[]
    appRoleAssignmentRequired: boolean
    servicePrincipalType: 'Application' | 'ManagedIdentity' | 'Legacy'
    tags: string[] // Often used for "WindowsAzureActiveDirectoryCustomSingleSignOnApplication"

    // Permissions & Roles
    appRoles: AppRole[]
    oauth2PermissionScopes: PermissionScope[]

    // Metadata
    createdDateTime?: string
    description?: string
    homepage?: string
    logoutUrl?: string
    notes?: string

    // Owners and Policy
    preferredSingleSignOnMode?: 'saml' | 'password' | 'oauth' | 'none'
    preferredTokenSigningKeyThumbprint?: string
    samlSingleSignOnSettings?: SamlSingleSignOnSettings

    // Reference to the App in the tenant
    info?: {
        logoUrl?: string
        marketingUrl?: string
        privacyStatementUrl?: string
        supportUrl?: string
        termsOfServiceUrl?: string
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

export interface PermissionScope {
    id: string
    adminConsentDescription: string
    adminConsentDisplayName: string
    isEnabled: boolean
    type: 'User' | 'Admin'
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
