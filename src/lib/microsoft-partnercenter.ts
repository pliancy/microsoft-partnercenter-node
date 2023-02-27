import { AxiosInstance } from 'axios'
import type { IPartnerCenterConfig } from './types/common.types'
import type { Customer } from './types/customers.types'
import type { Invoice } from './types/invoices.types'
import type { Subscription } from './types/subscriptions.types'
import { createHttpAgent } from './utils/create-http-agent'

export class PartnerCenter {
    private readonly httpAgent: AxiosInstance
    constructor(private readonly config: IPartnerCenterConfig) {
        this.httpAgent = createHttpAgent(config)
    }

    async getAllCustomers(): Promise<Customer[]> {
        const { data } = await this.httpAgent('/customers')
        return data.items
    }

    async getInvoices(): Promise<Invoice[]> {
        const { data } = await this.httpAgent('/invoices')
        return data.items
    }

    async getInvoicePDF(invoiceID: string): Promise<Buffer> {
        const { data } = await this.httpAgent(`/invoices/${invoiceID}/documents/statement`, {
            responseType: 'arraybuffer',
        })
        return data
    }

    async getCustomerById(customerId: string): Promise<Customer> {
        const { data } = await this.httpAgent(`/customers/${customerId}`)
        return data
    }

    async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
        const { data } = await this.httpAgent(`/customers/${customerId}/subscriptions`)
        return data.items
    }

    async getCustomerSubscriptionById(
        customerId: string,
        subscriptionId: string,
    ): Promise<Subscription> {
        const { data } = await this.httpAgent(
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
    ): Promise<object> {
        const subscription = await this.getCustomerSubscriptionById(customerId, subscriptionId)
        subscription.quantity = usersQuantity
        const { data } = await this.httpAgent(
            `/customers/${customerId}/subscriptions/${subscriptionId}`,
            {
                method: 'patch',
                data: subscription,
            },
        )
        return data
    }

    async updateCustomerSubscription(
        customerId: string,
        subscriptionId: string,
        subscription: Partial<Subscription>,
    ): Promise<Subscription> {
        const url = `/customers/${customerId}/subscriptions/${subscriptionId}`
        const { data } = await this.httpAgent(url, {
            method: 'patch',
            data: subscription,
        })
        return data
    }

    async createSubscription(
        customerId: string,
        offerId: string,
        quantity: number,
        billingCycle: 'monthly' | 'annual' | 'none' | 'oneTime' | 'triennial' | 'unknown',
    ): Promise<Subscription> {
        const url = `/customers/${customerId}/orders`
        const { data } = await this.httpAgent(url, {
            method: 'post',
            data: {
                lineItems: [
                    {
                        offerId: offerId,
                        quantity: quantity,
                        lineItemNumber: 0,
                    },
                ],
                billingCycle: billingCycle,
            },
        })
        return data
    }
}
