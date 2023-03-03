import { BillingPlan, Link } from './common.types'

export interface OrderLineItem {
    attestationAccepted?: boolean
    friendlyName?: string
    lineItemNumber?: number
    offerId: string
    termDuration?: BillingPlan
    customTermEndDate?: string
    quantity: number
    parentSubscriptionId?: string
    promotionId?: string
    renewsTo?: any
    transactionType?: string
}

export interface OrderLineItemOptions {
    attestationAccepted?: boolean
    friendlyName?: string
    lineItemNumber?: number
    customTermEndDate?: string
    parentSubscriptionId?: string
    promotionId?: string
    renewsTo?: any
    transactionType?: string
}

export interface OrderResponse {
    id: string
    alternateId: string
    referenceCustomerId: string
    billingCycle: string
    currencyCode: string
    currencySymbol: string
    lineItems: OrderLineItem[]
    creationDate: Date
    status: string
    transactionType: string
    links: Links
    client: any
    attributes: OrderAttributes
}

export interface OrderAttributes {
    objectType: string
}

interface Links {
    self: Link
    provisioningStatus: Link
    patchOperation: Link
}
