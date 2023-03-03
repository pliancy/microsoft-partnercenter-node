import type { LinksBase } from './common.types'
export interface Customer {
    id: string
    companyProfile: CompanyProfile
    relationshipToPartner: RelationshipToPartner
    links: Links
    attributes: Attributes
}

export interface Attributes {
    objectType: ObjectType
}

export enum ObjectType {
    Customer = 'Customer',
    CustomerCompanyProfile = 'CustomerCompanyProfile',
}

export interface CompanyProfile {
    tenantId: string
    domain: string
    companyName: string
    links: Links
    attributes: Attributes
}

export type Links = LinksBase

export enum RelationshipToPartner {
    Reseller = 'reseller',
}
