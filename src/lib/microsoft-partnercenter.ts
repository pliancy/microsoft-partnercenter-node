import { AxiosInstance } from 'axios'
import { ApplicationConsent } from './types'
import { Availability } from './types/availabilities.types'
import { IPartnerCenterConfig } from './types/common.types'
import { Customer } from './types/customers.types'
import { Invoice } from './types/invoices.types'
import { OrderLineItem, OrderLineItemOptions, OrderResponse } from './types/orders.types'
import { Sku } from './types/sku.types'
import { Subscription } from './types/subscriptions.types'
import { createHttpAgent } from './utils/create-http-agent'

export class MicrosoftPartnerCenter {
    private readonly httpAgent: AxiosInstance
    constructor(config: IPartnerCenterConfig) {
        this.httpAgent = createHttpAgent(config)
    }

    async getAllCustomers(): Promise<Customer[]> {
        const { data } = await this.httpAgent.get('/customers')
        return data.items
    }

    async getInvoices(): Promise<Invoice[]> {
        const { data } = await this.httpAgent.get('/invoices')
        return data.items
    }

    async getInvoicePDF(invoiceID: string): Promise<Buffer> {
        const { data } = await this.httpAgent.get(`/invoices/${invoiceID}/documents/statement`, {
            responseType: 'arraybuffer',
        })
        return data
    }

    async getCustomerById(customerId: string): Promise<Customer> {
        const { data } = await this.httpAgent.get(`/customers/${customerId}`)
        return data
    }

    async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
        const { data } = await this.httpAgent.get(`/customers/${customerId}/subscriptions`)
        return data.items
    }

    async getCustomerSubscriptionById(
        customerId: string,
        subscriptionId: string,
    ): Promise<Subscription> {
        const { data } = await this.httpAgent.get(
            `/customers/${customerId}/subscriptions/${subscriptionId}`,
        )
        return data
    }

    async getCustomerSubscriptionByOfferId(customerId: string, offerId: string) {
        const subs = await this.getCustomerSubscriptions(customerId)
        const sub = subs.find((e: any) => e.offerId === offerId)
        return sub
    }

    async updateCustomerSubscriptionUsers(
        customerId: string,
        subscriptionId: string,
        usersQuantity: number,
    ): Promise<Subscription> {
        const subscription = await this.getCustomerSubscriptionById(customerId, subscriptionId)
        subscription.quantity = usersQuantity
        const { data } = await this.httpAgent.patch(
            `/customers/${customerId}/subscriptions/${subscriptionId}`,
            subscription,
        )
        return data
    }

    async updateCustomerSubscription(
        customerId: string,
        subscriptionId: string,
        subscription: Partial<Subscription>,
    ): Promise<Subscription> {
        const url = `/customers/${customerId}/subscriptions/${subscriptionId}`
        const currentSubscription = await this.getCustomerSubscriptionById(
            customerId,
            subscriptionId,
        )
        const updatedSubscription = { ...currentSubscription, ...subscription }
        const { data } = await this.httpAgent.patch(url, updatedSubscription)
        return data
    }

    async createOrder(
        customerId: string,
        billingCycle: 'monthly' | 'annual',
        lineItems: OrderLineItem[],
    ): Promise<OrderResponse> {
        const url = `/customers/${customerId}/orders`

        if (lineItems.some((e) => !e.lineItemNumber)) {
            lineItems.forEach((e, i) => {
                e.lineItemNumber = i
            })
        }

        const { data } = await this.httpAgent.post(url, {
            lineItems,
            billingCycle,
        })
        return data
    }

    /**
     * This method creates an order for the first SKU and first availability found for the given product id (NCE)
     */
    async createOrderByProductId(
        customerId: string,
        productId: string,
        quantity: number,
        billingCycle: 'monthly' | 'annual',
        options?: OrderLineItemOptions,
    ): Promise<OrderResponse> {
        const skus = await this.getSkusByCustomer(customerId, productId)

        const skuId = skus[0]?.id

        if (!skuId) throw new Error('No SKU found for this product.')

        const availabilities = await this.getAvailabilitiesByCustomer(customerId, productId, skuId)

        const availabilityId = availabilities[0]?.id

        if (!availabilityId) throw new Error('No availability found for this product.')

        return this.createOrder(customerId, billingCycle, [
            {
                offerId: `${productId}:${skuId}:${availabilityId}`,
                quantity,
                ...options,
            },
        ])
    }

    async getSkusByCustomer(customerId: string, productId: string): Promise<Sku[]> {
        const url = `/customers/${customerId}/products/${productId}/skus`
        const { data } = await this.httpAgent.get(url)
        return data.items
    }

    async getAvailabilitiesByCustomer(
        customerId: string,
        productId: string,
        sku: string,
    ): Promise<Availability[]> {
        const url = `/customers/${customerId}/products/${productId}/skus/${sku}/availabilities`
        const { data } = await this.httpAgent.get(url)
        return data.items
    }

    async createApplicationConsent(
        customerId: string,
        applicationConsent: ApplicationConsent,
    ): Promise<Subscription> {
        const url = `/customers/${customerId}/applicationconsents`
        const { data } = await this.httpAgent.post(url, applicationConsent)
        return data
    }

    async removeApplicationConsent(customerId: string, applicationConsentId: string) {
        const url = `/customers/${customerId}/applicationconsents/${applicationConsentId}`
        await this.httpAgent.delete(url)
    }
}
