export interface CreateGDAPRelationship {
    displayName: string
    duration: string
    customer: GDAPCustomer
    accessDetails: AccessDetails
    autoExtendDuration: string
}

export interface AccessDetails {
    unifiedRoles: UnifiedRole[]
}

export interface UnifiedRole {
    roleDefinitionId: string
}

export interface GDAPCustomer {
    tenantId: string
    displayName: string
}

export type GDAPRelationshipStatus =
    | 'activating'
    | 'active'
    | 'approvalPending'
    | 'approved'
    | 'created'
    | 'expired'
    | 'expiring'
    | 'terminated'
    | 'terminating'
    | 'terminationRequested'
    | 'unknownFutureValue'

export interface GDAPRelationship {
    '@odata.type': '#microsoft.graph.delegatedAdminRelationship'
    '@odata.context': 'https://graph.microsoft.com/v1.0/tenantRelationships/$metadata#delegatedAdminRelationships'
    '@odata.etag': string
    id: string
    displayName: string
    duration: string
    customer: GDAPCustomer
    accessDetails: AccessDetails
    status: GDAPRelationshipStatus
    autoExtendDuration: string
    createdDateTime: Date
    lastModifiedDateTime: Date
    activatedDateTime: string
    endDateTime: Date
}

export interface AccessDetails {
    unifiedRoles: UnifiedRole[]
}

export interface CreateGDAPAccessAssignment {
    accessContainer: {
        accessContainerId: string
        accessContainerType: string
    }
    accessDetails: {
        unifiedRoles: GDAPUnifiedRole[]
    }
}

export interface UpdateGDAPAccessAssignment {
    accessDetails: {
        unifiedRoles: GDAPUnifiedRole[]
    }
}

export interface GDAPUnifiedRole {
    roleDefinitionId: string
}

export interface GDAPAccessAssignment {
    '@odata.type': '#microsoft.graph.delegatedAdminAccessAssignment'
    '@odata.context': 'https://graph.microsoft.com/v1.0/tenantRelationships/$metadata#accessAssignments'
    '@odata.etag': string
    id: string
    status: string
    createdDateTime: Date
    lastModifiedDateTime: Date
    accessContainer: {
        accessContainerId: string
        accessContainerType: string
    }
    accessDetails: {
        unifiedRoles: GDAPUnifiedRole[]
    }
}

export type GDAPRelationshipRequestAction =
    | 'lockForApproval'
    | 'approve'
    | 'terminate'
    | 'unknownFutureValue'
    | 'reject'

export interface GDAPRelationshipRequest {
    '@odata.type': '#microsoft.graph.delegatedAdminRelationshipRequest'
    '@odata.context': 'https://graph.microsoft.com/v1.0/tenantRelationships/$metadata#requests'
    id: string
    action: GDAPRelationshipRequestAction
    status: 'created' | 'pending' | 'succeeded' | 'failed' | 'unknownFutureValue'
    createdDateTime: Date
    lastModifiedDateTime: Date
}
