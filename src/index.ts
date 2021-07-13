import axios, { AxiosRequestConfig } from 'axios'
import qs from 'querystring'

interface IPartnerCenterConfig {
    /** partner center primary domain for your partner account */
    partnerDomain: string
    authentication: ClientAuth
    /** timeout threshold in milliseconds */
    timeoutMs?: number
}
interface ClientAuth {
    clientId: string
    clientSecret: string
}

interface IOAuthResponse {
    token_type: string
    expires_in: string
    ext_expires_in: string
    expires_on: string
    not_before: string
    resource: string
    access_token: string
}

class PartnerCenter {
    private readonly config: IPartnerCenterConfig
    private accessToken: string
    private readonly reqHeaders: any

    constructor(_config: IPartnerCenterConfig) {
        this.config = _config
        this.accessToken = ''
        this.reqHeaders = {
            authorization: `Bearer ${this.accessToken}`,
        }
    }

    /* eslint-disable no-useless-catch */
    async getAllCustomers(): Promise<object[]> {
        const res = await this._partnerCenterRequest(
            'https://api.partnercenter.microsoft.com/v1/customers',
        )
        return res.items
    }

    async getInvoices(): Promise<object[]> {
        const res = await this._partnerCenterRequest(
            'https://api.partnercenter.microsoft.com/v1/invoices',
        )
        return res.items
    }

    async getInvoicePDF(invoiceID: string): Promise<Buffer> {
        const res = await this._partnerCenterRequest(
            `https://api.partnercenter.microsoft.com/v1/invoices/${invoiceID}/documents/statement`,
            { responseType: 'arraybuffer' },
        )
        return res
    }

    async getCustomerById(customerId: string): Promise<object> {
        const res = await this._partnerCenterRequest(
            `https://api.partnercenter.microsoft.com/v1/customers/${customerId}`,
        )
        return res
    }

    async getCustomerSubscriptions(customerId: string): Promise<object[]> {
        const res = await this._partnerCenterRequest(
            `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions`,
        )
        return res.items
    }

    async getCustomerSubscriptionById(customerId: string, subscriptionId: string): Promise<object> {
        const res = await this._partnerCenterRequest(
            `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`,
        )
        return res
    }

    async getCustomerSubscriptionByOfferId(customerId: string, offerId: string): Promise<object> {
        const allSubs = await this._partnerCenterRequest(
            `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions`,
        )
        const sub = allSubs.items.find((e: any) => e.offerId === offerId)
        return sub
    }

    async updateCustomerSubscriptionUsers(
        customerId: string,
        subscriptionId: string,
        usersQuantity: number,
    ): Promise<object> {
        const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`
        const subscription = await this._partnerCenterRequest(url)
        subscription.Quantity = usersQuantity
        const res = await this._partnerCenterRequest(url, {
            method: 'patch',
            data: subscription,
        })
        return res
    }

    async updateCustomerSubscription(
        customerId: string,
        subscriptionId: string,
        subscriptionObject: object,
    ): Promise<object> {
        const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`
        const res = await this._partnerCenterRequest(url, {
            method: 'patch',
            data: subscriptionObject,
        })
        return res
    }

    async createSubscription(
        customerId: string,
        offerId: string,
        usersQuantity: number,
        billingCycle: 'monthly' | 'annual',
    ): Promise<object> {
        const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/orders`
        const res = await this._partnerCenterRequest(url, {
            method: 'post',
            data: {
                lineItems: [
                    {
                        offerId: offerId,
                        quantity: usersQuantity,
                        lineItemNumber: 0,
                    },
                ],
                billingCycle: billingCycle,
            },
        })
        return res
    }

    private async _authenticate(): Promise<string> {
        const res = await axios.post(
            `https://login.windows.net/${this.config.partnerDomain}/oauth2/token`,
            qs.stringify({
                grant_type: 'client_credentials',
                resource: 'https://graph.windows.net',
                client_id: this.config.authentication.clientId,
                client_secret: this.config.authentication.clientSecret,
            }),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
            },
        )
        const body: IOAuthResponse = res.data
        this.accessToken = body.access_token
        return body.access_token
    }

    private async _partnerCenterRequest(
        url: string,
        optionsOverride?: AxiosRequestConfig,
    ): Promise<any> {
        const options: AxiosRequestConfig = {
            headers: this.reqHeaders,
            timeout: this.config.timeoutMs ?? 20000,
            ...(optionsOverride ?? {}),
        }
        try {
            if (!this.accessToken) {
                await this._authenticate()
                options.headers.authorization = `Bearer ${this.accessToken}`
            }
            const res = await axios(url, options)
            return res.data
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 500) {
                await this._authenticate()
                options.headers.authorization = `Bearer ${this.accessToken}`
                const res = await axios(url, options)
                return res.data
            }
            throw err
        }
    }
}

export = PartnerCenter
