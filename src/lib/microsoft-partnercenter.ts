import {
    ApplicationConsent,
    CreateUser,
    SetUserRole,
    SetUserRoleResponse,
    User,
    UserRole,
} from './types'
import { Availability } from './types/availabilities.types'
import { IPartnerCenterConfig } from './types/common.types'
import { CreateCustomer, Customer } from './types/customers.types'
import { Invoice } from './types/invoices.types'
import { OrderLineItem, OrderLineItemOptions, OrderResponse } from './types/orders.types'
import { Sku } from './types/sku.types'
import { Subscription } from './types/subscriptions.types'
import {
    LicenseUsage,
    LicenseAssignmentRequest,
    LicenseAssignmentResponse,
    UserLicenseAssignment,
} from './types/licenses.types'
import { MicrosoftApiBase } from './microsoft-api-base'

export class MicrosoftPartnerCenter extends MicrosoftApiBase {
    constructor(config: IPartnerCenterConfig) {
        super(
            config,
            'https://api.partnercenter.microsoft.com/v1/',
            'https://api.partnercenter.microsoft.com/.default',
        )
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

    async createCustomer(data: CreateCustomer): Promise<Customer> {
        const { data: customer } = await this.httpAgent.post('/customers', data)
        return customer
    }

    async createCustomerUser(customerId: string, data: CreateUser): Promise<User> {
        const { data: user } = await this.httpAgent.post(`/customers/${customerId}/users`, data)
        return user
    }

    async getAllCustomerUsers(customerId: string): Promise<User[]> {
        const { data } = await this.httpAgent.get(`/customers/${customerId}/users`)
        return data.items
    }

    async getCustomerUserById(customerId: string, userId: string): Promise<User> {
        const { data } = await this.httpAgent.get(`/customers/${customerId}/users/${userId}`)
        return data
    }

    async getCustomerUserByPrincipalName(
        customerId: string,
        principalName: string,
    ): Promise<User | undefined> {
        const users = await this.getAllCustomerUsers(customerId)
        return users.find((e) => e.userPrincipalName === principalName)
    }

    async getCustomerUserRoles(customerId: string, userId: string): Promise<UserRole[]> {
        const { data } = await this.httpAgent.get(
            `/customers/${customerId}/users/${userId}/directoryroles`,
        )
        return data.items
    }

    async setCustomerUserPassword(
        customerId: string,
        userId: string,
        password: string,
        forceChangePassword: boolean,
    ): Promise<User> {
        const { data } = await this.httpAgent.patch(
            `/customers/${customerId}/users/${userId}/resetpassword`,
            {
                passwordProfile: {
                    password,
                    forceChangePassword,
                },
                attributes: {
                    objectType: 'CustomerUser',
                },
            },
        )
        return data
    }

    async setCustomerUserRole(
        customerId: string,
        roleId: string,
        data: SetUserRole,
    ): Promise<SetUserRoleResponse> {
        const { data: userRole } = await this.httpAgent.post(
            `/customers/${customerId}/directoryroles/${roleId}/usermembers`,
            data,
        )
        return userRole
    }

    /**
     *  Assigns licenses to a user
     * https://learn.microsoft.com/en-us/partner-center/developer/assign-licenses-to-a-user
     * @param customerId
     * @param userId
     * @param licenses
     * @returns
     */
    async assignLicensesToCustomerUser(
        customerId: string,
        userId: string,
        licenses: LicenseAssignmentRequest,
    ): Promise<LicenseAssignmentResponse> {
        const { data } = await this.httpAgent.post(
            `/customers/${customerId}/users/${userId}/licenseupdates`,
            licenses,
        )
        return data
    }

    /**
     * Gets licenses assigned to a user
     * https://learn.microsoft.com/en-us/partner-center/developer/check-which-licenses-are-assigned-to-a-user
     * @param customerId
     * @param userId
     * @returns
     */
    async getCustomerUserLicenseAssignments(
        customerId: string,
        userId: string,
    ): Promise<UserLicenseAssignment[]> {
        const { data } = await this.httpAgent.get(
            `/customers/${customerId}/users/${userId}/licenses`,
        )
        return data.items
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

    async getSkuById(customerId: string, productId: string, skuId: string): Promise<Sku> {
        const url = `/customers/${customerId}/products/${productId}/skus/${skuId}`
        const { data } = await this.httpAgent.get(url)
        return data
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

    /**
     *  Creates an application consent
     * https://learn.microsoft.com/en-us/partner-center/developer/control-panel-vendor-apis#acquire-consent
     * @param customerId
     * @param applicationConsent
     * @returns
     */
    async createApplicationConsent(
        customerId: string,
        applicationConsent: ApplicationConsent,
    ): Promise<Subscription> {
        const url = `/customers/${customerId}/applicationconsents`
        const { data } = await this.httpAgent.post(url, applicationConsent)
        return data
    }

    /**
     *  Removes an application consent
     * https://learn.microsoft.com/en-us/partner-center/developer/control-panel-vendor-apis#remove-consent
     * @param customerId
     * @param applicationConsentId
     */
    async removeApplicationConsent(customerId: string, applicationConsentId: string) {
        const url = `/customers/${customerId}/applicationconsents/${applicationConsentId}`
        await this.httpAgent.delete(url)
    }

    /**
     *  Gets License usage and availability for a customer
     * https://learn.microsoft.com/en-us/partner-center/developer/get-a-list-of-available-licenses
     * @param customerId
     * @returns
     */
    async getCustomerLicenseUsage(customerId: string): Promise<LicenseUsage[]> {
        const url = `/customers/${customerId}/subscribedskus`
        const { data } = await this.httpAgent.get(url)
        return data.items
    }
}
