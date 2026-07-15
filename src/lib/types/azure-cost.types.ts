export interface AzureCostRow {
    serviceName: string
    cost: number
    currency: string
}

export interface BillingCustomer {
    /** Short billing-account customer ID used in Cost Management URL paths. */
    id: string
    displayName: string
    /** Microsoft tenant ID — matches the OFFICE365 app `data.id` in Pliancy. */
    tenantId: string
}
