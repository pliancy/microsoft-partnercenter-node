import { GraphUser } from '../users/user.types'

export interface AssignedLicense {
    disabledPlans: AssignedLicense[]
    skuId: string
}

export interface GraphUserAssignedLicense
    extends Pick<GraphUser, 'id' | 'userPrincipalName' | 'displayName'> {
    assignedLicenses: AssignedLicense[]
}

export interface SubscribedSku {
    accountName: string
    accountId: string
    appliesTo: string
    capabilityStatus: string
    consumedUnits: number
    id: string
    skuId: string
    skuPartNumber: string
    subscriptionIds: string[]
    prepaidUnits: PrepaidUnits
    servicePlans: ServicePlan[]
}

export interface PrepaidUnits {
    enabled: number
    suspended: number
    warning: number
    lockedOut: number
}

export interface ServicePlan {
    servicePlanId: string
    servicePlanName: string
    provisioningStatus: string
    appliesTo: string
}
