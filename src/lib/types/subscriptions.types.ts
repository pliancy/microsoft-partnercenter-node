import type { Link, LinksBase } from './common.types'

export interface ProductTerm {
    productId: string
    skuId: string
    availabilityId: string
    billingCycle: BillingCycle | string
    termDuration: TermDuration | string
    promotionId?: string
}

export interface ScheduledNextTermInstructions {
    product: ProductTerm
    quantity: number
    customTermEndDate?: string | Date
}

export enum ScheduledActionType {
    Cancel = 'Cancel',
    RenewToNewTerm = 'RenewToNewTerm',
    RenewToExtendedServiceTerm = 'RenewToExtendedServiceTerm',
    Transition = 'Transition',
}

export enum ScheduledActionScheduleType {
    TermEnd = 'TermEnd',
    CustomDate = 'CustomDate',
}

export interface ScheduledAction {
    scheduleType: ScheduledActionScheduleType | string
    actionType: ScheduledActionType | string
    effectiveDate?: string | Date
    instructions?: ScheduledNextTermInstructions
}

export interface Subscription {
    id: string
    offerId: string
    offerName: string
    friendlyName: string
    productType?: ProductType
    quantity: number
    unitType: UnitType
    hasPurchasableAddons: boolean
    creationDate: Date
    effectiveStartDate: Date
    commitmentEndDate: Date
    cancellationAllowedUntilDate?: Date
    billingCycleEndDate?: Date
    customTermEndDate?: string | Date
    status: Status
    autoRenewEnabled: boolean
    isTrial: boolean
    billingType: BillingType
    billingCycle: BillingCycle
    termDuration: TermDuration
    renewalTermDuration?: string
    promotionId?: string
    isMicrosoftProduct: boolean
    partnerId?: string
    attentionNeeded: boolean
    actionTaken: boolean
    contractType: ContractType
    links: Links
    publisherName?: string
    orderId: string
    attributes: Attributes
    entitlementId?: string
    actions?: Action[]
    suspensionReasons?: SuspensionReason[]
    refundOption?: SubscriptionRefundableOption[]
    refundableQuantity?: {
        totalQuantity: number
        details: SubscriptionRefundableQuantityDetail[]
    }
    scheduledNextTermInstructions?: ScheduledNextTermInstructions | null
    scheduledActions?: ScheduledAction[] | null
}

export interface SubscriptionRefundableQuantityDetail {
    quantity: number
    allowedUntilDateTime: Date
}

export interface SubscriptionRefundableOption {
    type: string
    expiresAt: Date
}

export enum Action {
    Cancel = 'Cancel',
    Edit = 'Edit',
}

interface Attributes {
    objectType: ObjectType
    etag?: string
}

enum ObjectType {
    Subscription = 'Subscription',
}

export enum BillingCycle {
    Monthly = 'monthly',
}

export enum BillingType {
    License = 'license',
    Usage = 'usage',
}

export enum ContractType {
    Subscription = 'subscription',
}

interface Links extends LinksBase {
    product: Link
    sku: Link
    availability: Link
    offer?: Link
}

export interface ProductType {
    id: string
    displayName: string
}

export enum Status {
    Active = 'active',
    Deleted = 'deleted',
    Disabled = 'disabled',
    Suspended = 'suspended',
    Expired = 'expired',
}

export enum SuspensionReason {
    Expiration = 'Expiration',
}

export enum TermDuration {
    P1M = 'P1M',
    P1Y = 'P1Y',
}

export enum UnitType {
    Licenses = 'Licenses',
    UsageBased = 'Usage-based',
}
