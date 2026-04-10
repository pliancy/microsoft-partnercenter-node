export interface LicenseUsage {
    availableUnits: number
    activeUnits: number
    consumedUnits: number
    suspendedUnits: number
    totalUnits: number
    warningUnits: number
    productSku: ProductSku
    servicePlans: ServicePlan[]
    capabilityStatus: string
    attributes: Attributes
}

interface Attributes {
    objectType: string
}

interface ProductSku {
    id: string
    name: string
    skuPartNumber: string
    targetType: string
    licenseGroupId: string
}

interface ServicePlan {
    displayName: string
    serviceName: string
    id: string
    capabilityStatus: string
    targetType: string
}

export interface LicenseAssignmentRequest {
    licensesToAssign: {
        excludedPlans: string[] | null
        skuId: string
    }[]
    licensesToRemove: string[] | null
}

export interface LicenseAssignmentResponse {
    licensesToAssign: {
        skuId: string
    }[]
    licenseWarnings: string[]
    attributes: {
        objectType: 'LicenseUpdate'
    }
}

export interface UserLicenseAssignment {
    servicePlans: ServicePlan[]
    productSku: ProductSku
    attributes: Attributes
}

export interface OfferMatrixEntry {
    ProductTitle: string
    ProductId: string
    SkuId: string
    SkuTitle: string
    ProvisioningId: string
    ProvisioningString: string
    MinLicenses: string
    MaxLicenses: string
    AssetOwnershipLimit: string
    AssetOwnershipLimitType: string
    ProductSkuPreRequisites: string
    ProductSkuConversion: string
    Description: string
    AllowedCountries: string
}

export interface PriceSheetEntry {
    ProductTitle: string
    ProductId: string
    SkuId: string
    SkuTitle: string
    Publisher: string
    SkuDescription: string
    UnitOfMeasure: string
    TermDuration: 'P1M' | 'P1Y'
    BillingPlan: 'Annual' | 'Monthly'
    Market: string
    Currency: string
    UnitPrice: string
    PricingTierRangeMin?: string
    PricingTierRangeMax?: string
    EffectiveStartDate: string | Date
    EffectiveEndDate: string | Date
    Tags: string
    'ERP Price': number
    Segment: 'Commercial' | 'Government' | 'Education' | 'Charity'
}

export interface PlanIdentifierEntry {
    Product_Display_Name: string
    String_Id: string
    GUID: string
    Service_Plan_Name: string
    Service_Plan_Id: string
    Service_Plans_Included_Friendly_Names: string
}
