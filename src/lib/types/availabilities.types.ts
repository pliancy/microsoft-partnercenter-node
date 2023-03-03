import { BillingPlan, Link } from './common.types'
import { Sku } from './sku.types'

interface Attributes {
    objectType: string
}

export interface Availability {
    id: string
    productId: string
    skuId: string
    catalogItemId: string
    defaultCurrency: AvailabilityDefaultCurrency
    segment: string
    country: string
    isPurchasable: boolean
    isRenewable: boolean
    renewalInstructions: AvailabilityRenewalInstruction[]
    terms: Term[]
    links: ItemLinks
    product: AvailabilityProduct
    sku: Sku
}

export interface AvailabilityDefaultCurrency {
    code: string
    symbol: string
}

export interface ItemLinks {
    self: AvailabilitySelf
}

export type AvailabilitySelf = Link

export interface AvailabilityProduct {
    id: string
    title: string
    description: string
    productType: AvailabilityProductType
    isMicrosoftProduct: boolean
    publisherName: string
    links: ProductLinks
}

export interface ProductLinks {
    skus: AvailabilitySelf
    self: AvailabilitySelf
}

export interface AvailabilityProductType {
    id: string
    displayName: string
}

export interface AvailabilityRenewalInstruction {
    applicableTermIds: string[]
    renewalOptions: AvailabilityRenewalOption[]
}

export interface AvailabilityRenewalOption {
    renewToId: string
    isAutoRenewable: boolean
}

export interface Term {
    id: string
    duration: BillingPlan
    description: string
    billingCycle: string
    cancellationPolicies: CancellationPolicy[]
}

export interface CancellationPolicy {
    refundOptions: RefundOption[]
}

export interface RefundOption {
    sequenceId: number
    type: string
    expiresAfter: string
}
