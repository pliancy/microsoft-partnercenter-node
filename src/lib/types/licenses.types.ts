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
