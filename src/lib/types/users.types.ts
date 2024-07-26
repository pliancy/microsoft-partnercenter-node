export interface CreateUser {
    usageLocation: string
    userPrincipalName: string
    firstName: string
    lastName: string
    displayName: string
    passwordProfile: PasswordProfile
}

export interface PasswordProfile {
    forceChangePassword: boolean
    password: string
}

export interface User {
    usageLocation: string
    id: string
    userPrincipalName: string
    firstName: string
    lastName: string
    displayName: string
    immutableId: string
    passwordProfile: PasswordProfile
    lastDirectorySyncTime: null
    userDomainType: string
    state: string
    softDeletionTime: { objectType: 'CustomerUser' }
}

export interface SetUserRole {
    /**
     * The ID of the user
     */
    Id: string
    /**
     * The Display Name of the user
     */
    DisplayName: string
    /**
     * The User's Principal Name
     */
    UserPrincipalName: string
}

export interface SetUserRoleResponse {
    displayName: string
    userPrincipalName: string
    roleId: string
    id: string
    attributes: {
        objectType: 'UserMember'
    }
}

export interface UserRole {
    id: string
    name: string
    attributes: {
        objectType: 'DirectoryRole'
    }
}
