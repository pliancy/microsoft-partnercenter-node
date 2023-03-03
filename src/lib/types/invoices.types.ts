import type { LinksBase } from './common.types'

export interface Invoice {
    id: string
    invoiceDate: Date
    billingPeriodStartDate: Date
    billingPeriodEndDate: Date
    totalCharges: number
    paidAmount: number
    currencyCode: string
    currencySymbol: string
    pdfDownloadLink: string
    invoiceDetails: InvoiceDetail[]
    documentType: string
    state: string
    invoiceType: string
    links: LinksBase
    attributes: Attributes
}

interface Attributes {
    objectType: 'Invoice'
}

type Links = LinksBase

export interface InvoiceDetail {
    invoiceLineItemType: string
    billingProvider: string
    links: Links
    attributes: Attributes
}
