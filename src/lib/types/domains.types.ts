/**
 * Represents a domain entity in the system.
 */
export interface Domain {
    /**
     * Indicates the configured authentication type for the domain.
     * The value is either `Managed` or `Federated`.
     * `Managed` indicates a cloud managed domain where Microsoft Entra ID performs user authentication.
     * `Federated` indicates authentication is federated with an identity provider such as the tenant's on-premises Active Directory via Active Directory Federation Services.
     * To update this property in delegated scenarios, the calling app must be assigned the *Directory.AccessAsUser.All* delegated permission.
     */
    authenticationType: 'Managed' | 'Federated'

    /**
     * This property is always `null` except when the verify action is used.
     * When the verify action is used, a **domain** entity is returned in the response.
     * The **availabilityStatus** property of the **domain** entity in the response is either `AvailableImmediately` or `EmailVerifiedDomainTakeoverScheduled`.
     */
    availabilityStatus: 'AvailableImmediately' | 'EmailVerifiedDomainTakeoverScheduled' | null

    /**
     * The fully qualified name of the domain.
     * Key, immutable, not nullable, unique.
     */
    id: string

    /**
     * The value of the property is `false` if the DNS record management of the domain is delegated to Microsoft 365.
     * Otherwise, the value is `true`.
     */
    isAdminManaged: boolean

    /**
     * `true` if this is the default domain that is used for user creation.
     * There's only one default domain per company.
     */
    isDefault: boolean

    /**
     * `true` if this is the initial domain created by Microsoft Online Services (contoso.com).
     * There's only one initial domain per company.
     */
    isInitial: boolean

    /**
     * `true` if the domain is a verified root domain.
     * Otherwise, `false` if the domain is a subdomain or unverified.
     */
    isRoot: boolean

    /**
     * `true` if the domain has completed domain ownership verification.
     */
    isVerified: boolean

    /**
     * Specifies the number of days before a user receives notification that their password will expire.
     * If the property isn't set, a default value of 14 days is used.
     */
    passwordNotificationWindowInDays?: number

    /**
     * Specifies the length of time that a password is valid before it must be changed.
     * If the property isn't set, a default value of 90 days is used.
     */
    passwordValidityPeriodInDays?: number

    /**
     * Status of asynchronous operations scheduled for the domain.
     * This could represent various states of domain-related processes.
     * The exact structure and possible values are not specified in the original information.
     */
    state: {
        [key: string]: any // Using an index signature to allow for flexibility
    }

    /**
     * The capabilities assigned to the domain.
     * Can include `0`, `1` or more of following values:
     * `Email`, `Sharepoint`, `EmailInternalRelayOnly`, `OfficeCommunicationsOnline`,
     * `SharePointDefaultDomain`, `FullRedelegation`, `SharePointPublic`, `OrgIdAuthentication`, `Yammer`, `Intune`.
     * The values that you can add or remove using the API include: `Email`, `OfficeCommunicationsOnline`, `Yammer`.
     */
    supportedServices: Array<
        | 'Email'
        | 'Sharepoint'
        | 'EmailInternalRelayOnly'
        | 'OfficeCommunicationsOnline'
        | 'SharePointDefaultDomain'
        | 'FullRedelegation'
        | 'SharePointPublic'
        | 'OrgIdAuthentication'
        | 'Yammer'
        | 'Intune'
    >
}

export interface DomainDnsRecord {
    id: string
    isOptional: boolean
    label: string
    recordType: string
    supportedService: string
    ttl: number
    text: string
}
