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
    TermDuration: 'P1M' | 'P1Y' | 'P3Y' | 'P5Y' | 'NoTerm'
    BillingPlan: 'Annual' | 'Monthly'
    Market: string
    Currency: string
    UnitPrice: string
    PricingTierRangeMin?: string
    PricingTierRangeMax?: string
    EffectiveStartDate: string
    EffectiveEndDate: string
    Tags: string
    'ERP Price': string
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

export type PriceType = 'NewCommerceExperience' | 'ExtendedServiceTerm' | 'EndOfSupport'
export type PriceView = 'updatedlicensebased' | 'licensebasedest' | 'licensebasedeos'

export const PriceTypeMap = new Map<PriceType, PriceView>([
    ['NewCommerceExperience', 'updatedlicensebased'],
    ['ExtendedServiceTerm', 'licensebasedest'],
    ['EndOfSupport', 'licensebasedeos'],
])
