import { BillingPlan, Link } from './common.types'

export interface SkuAttributes {
    objectType: string
}

export interface Sku {
    id: string
    productId: string
    title: string
    description: string
    minimumQuantity: number
    maximumQuantity: number
    isTrial: boolean
    termsOfUseUri: string
    supportedBillingCycles: string[]
    purchasePrerequisites: string[]
    inventoryVariables: any[]
    provisioningVariables: any[]
    actions: string[]
    dynamicAttributes: SkuDynamicAttributes
    links: SkuItemLinks
}

export interface SkuDynamicAttributes {
    isMicrosoftProduct: boolean
    hasConstraints: boolean
    isAddon: boolean
    prerequisiteSkus: any[]
    isSoftwareAssuranceApplicable: boolean
    upgradeTargetOffers: string[]
    provisioningId: string
    billingType: string
    conversionInstructions: SkuConversionInstruction[]
    conversionTransferInstructions: ConversionTransferInstruction[]
}

export interface SkuConversionInstruction {
    applicableTermIds: string[]
    conversionOptions: SkuConversionOption[]
}

export interface SkuConversionOption {
    transferToId: string
    termTransferRules: SkuTermTransferRule[]
}

export interface SkuTermTransferRule {
    transferTiming: SkuTransferTiming
    allowedTransferToTermDurationAndBilling: SkuAllowedTransferToTermDurationAndBilling[]
}

export interface SkuAllowedTransferToTermDurationAndBilling {
    termDuration: BillingPlan
    billingPlan?: BillingPlan
}

export enum SkuTransferTiming {
    Immediate = 'Immediate',
    Scheduled = 'Scheduled',
}

export interface ConversionTransferInstruction {
    transferToBigId: string
    transferTiming: SkuTransferTiming
}

export interface SkuItemLinks {
    availabilities: SkuLink
    self: SkuLink
}

export type SkuLink = Link

export interface SkuLinks {
    self: SkuLink
}
