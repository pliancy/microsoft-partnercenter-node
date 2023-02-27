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
        const res = (await this.httpAgent(
            'https://api.partnercenter.microsoft.com/v1/customers',
        )) as unknown as { items: Customer[] }
        return res.items
    }

    async getInvoices() {
        const res = (await this.httpAgent(
            'https://api.partnercenter.microsoft.com/v1/invoices',
        )) as unknown as { items: Invoice[] }
        return res.items
    }

    async getInvoicePDF(invoiceID: string) {
        const res = (await this.httpAgent(
            `https://api.partnercenter.microsoft.com/v1/invoices/${invoiceID}/documents/statement`,
            { responseType: 'arraybuffer' },
        )) as unknown as Buffer
        return res
    }

    async getCustomerById(customerId: string) {
        const res = (await this.httpAgent(
            `https://api.partnercenter.microsoft.com/v1/customers/${customerId}`,
        )) as unknown as Customer
        return res
    }

    async getCustomerSubscriptions(customerId: string) {
        const res = (await this.httpAgent(
            `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions`,
        )) as unknown as { items: Subscription[] }
        return res.items
    }

    async getCustomerSubscriptionById(customerId: string, subscriptionId: string) {
        const res = (await this.httpAgent(
            `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`,
        )) as unknown as Subscription
        return res
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
        const res = await this.httpAgent(
            `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`,
            {
                method: 'patch',
                data: subscription,
            },
        )
        return res
    }

    async updateCustomerSubscription(
        customerId: string,
        subscriptionId: string,
        subscription: Partial<Subscription>,
    ): Promise<object> {
        const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`
        const res = await this.httpAgent(url, {
            method: 'patch',
            data: subscription,
        })
        return res
    }

    async createSubscription(
        customerId: string,
        offerId: string,
        quantity: number,
        billingCycle: 'monthly' | 'annual' | 'none' | 'oneTime' | 'triennial' | 'unknown',
    ): Promise<object> {
        const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/orders`
        const res = await this.httpAgent(url, {
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
        return res
    }
}
