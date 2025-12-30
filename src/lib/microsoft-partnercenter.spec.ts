import { MicrosoftPartnerCenter } from './microsoft-partnercenter'
import mockAxios from 'jest-mock-axios'
import { OrderLineItem } from './types/orders.types'
import { ApplicationConsent } from './types'
import { TokenManager } from './utils/http-token-manager'

describe('Microsoft Partner Center', () => {
    let partnerCenter: MicrosoftPartnerCenter

    beforeEach(() => {
        partnerCenter = new MicrosoftPartnerCenter({
            partnerDomain: 'test',
            authentication: {
                clientId: 'test',
                clientSecret: 'test',
            },
        })
    })

    afterEach(() => {
        mockAxios.reset()
    })

    it('should get all customers', async () => {
        const customers = [{ id: '1' }, { id: '2' }]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: customers } })
        const result = await partnerCenter.getAllCustomers()
        expect(result).toEqual(customers)
    })

    it('should get all invoices', async () => {
        const invoices = [{ id: '1' }, { id: '2' }]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: invoices } })
        const result = await partnerCenter.getInvoices()
        expect(result).toEqual(invoices)
    })

    it('should get invoice pdf', async () => {
        const pdf = Buffer.from('test')
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: pdf })
        const result = await partnerCenter.getInvoicePDF('1')
        expect(result).toEqual(pdf)
    })

    it('should get customer by id', async () => {
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { id: '1' } })
        const result = await partnerCenter.getCustomerById('1')
        expect(result).toEqual({ id: '1' })
    })

    it('should get customer subscriptions', async () => {
        const subscriptions = [{ id: '1' }, { id: '2' }]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: subscriptions } })
        const result = await partnerCenter.getCustomerSubscriptions('1')
        expect(result).toEqual(subscriptions)
    })

    it('should get customer subscription by id', async () => {
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { id: '1' } })
        const result = await partnerCenter.getCustomerSubscriptionById('1', '1')
        expect(result).toEqual({ id: '1' })
    })

    it('should get customer subscription by offer id', async () => {
        const subscriptions = [
            { id: '1', offerId: '1' },
            { id: '2', offerId: '2' },
        ]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: subscriptions } })
        const result = await partnerCenter.getCustomerSubscriptionByOfferId('1', '1')
        expect(result).toEqual({ id: '1', offerId: '1' })
    })

    it('should update customer subscription users', async () => {
        const subscription = { id: '1', quantity: 1 }
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: subscription })
        jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: subscription })
        const result = await partnerCenter.updateCustomerSubscriptionUsers('1', '1', 2)
        expect(result).toEqual(subscription)
    })

    it('should create an order', async () => {
        const subscription = { id: '1', quantity: 16 }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: subscription })
        const lineItems: OrderLineItem[] = [
            {
                offerId: '1',
                quantity: 16,
                termDuration: 'P1M',
            },
        ]

        const result = await partnerCenter.createOrder('1', 'monthly', lineItems)
        expect(result).toEqual(subscription)
        expect(mockAxios.post).toHaveBeenCalledWith('/customers/1/orders', {
            lineItems: lineItems.map((item, idx) => ({
                ...item,
                lineItemNumber: idx,
            })),
            billingCycle: 'monthly',
        })
    })

    it('should get skus by customer', async () => {
        const offers = [{ id: '1' }, { id: '2' }]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: offers } })
        const result = await partnerCenter.getSkusByCustomer('1', 'productId')
        expect(result).toEqual(offers)
        expect(mockAxios.get).toHaveBeenCalledWith('/customers/1/products/productId/skus')
    })

    it('should get availabilities by customer', async () => {
        const offers = [{ id: '1' }, { id: '2' }]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: offers } })
        const result = await partnerCenter.getAvailabilitiesByCustomer('1', 'productId', 'skuId')
        expect(result).toEqual(offers)
        expect(mockAxios.get).toHaveBeenCalledWith(
            '/customers/1/products/productId/skus/skuId/availabilities',
        )
    })

    it('should create an order by product id', async () => {
        const subscription = { id: '1', quantity: 16 }
        jest.spyOn(mockAxios, 'get').mockResolvedValueOnce({ data: { items: [{ id: 'skuId' }] } })
        jest.spyOn(mockAxios, 'get').mockResolvedValueOnce({
            data: { items: [{ id: 'availabilityId' }] },
        })
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: subscription })

        const lineItems: OrderLineItem[] = [
            {
                offerId: 'productId:skuId:availabilityId',
                quantity: 16,
            },
        ]

        const result = await partnerCenter.createOrderByProductId('1', 'productId', 16, 'monthly')
        expect(result).toEqual(subscription)
        expect(mockAxios.post).toHaveBeenCalledWith('/customers/1/orders', {
            lineItems: lineItems.map((item, idx) => ({
                ...item,
                lineItemNumber: idx,
            })),
            billingCycle: 'monthly',
        })
    })

    it('should create an application consent', async () => {
        const consent: ApplicationConsent = {
            applicationId: '1',
            applicationGrants: [
                {
                    scope: '1',
                    enterpriseApplicationId: '1',
                },
            ],
        }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: consent })
        const result = await partnerCenter.createApplicationConsent('1', consent)
        expect(result).toEqual(consent)
        expect(mockAxios.post).toHaveBeenCalledWith('/customers/1/applicationconsents', consent)
    })

    it('should remove an application consent', async () => {
        jest.spyOn(mockAxios, 'delete').mockResolvedValue({ data: {} })
        const result = await partnerCenter.removeApplicationConsent('1', '1')
        expect(result).toBeUndefined()
        expect(mockAxios.delete).toHaveBeenCalledWith('/customers/1/applicationconsents/1')
    })

    it('should get license usage by customer', async () => {
        const licenses = [{ id: '1' }, { id: '2' }]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: licenses } })
        const result = await partnerCenter.getCustomerLicenseUsage('1')
        expect(result).toEqual(licenses)
        expect(mockAxios.get).toHaveBeenCalledWith('/customers/1/subscribedskus')
    })

    it('should create a customer', async () => {
        const customer = { id: '1' }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: customer })
        const result = await partnerCenter.createCustomer({ id: '1' } as never)
        expect(result).toEqual(customer)
        expect(mockAxios.post).toHaveBeenCalledWith('/customers', { id: '1' })
    })

    it('should delete a customer user', async () => {
        jest.spyOn(mockAxios, 'delete').mockResolvedValue({ data: {} })
        const result = await partnerCenter.deleteCustomerUser('1', '1')
        expect(result).toBeUndefined()
        expect(mockAxios.delete).toHaveBeenCalledWith('/customers/1/users/1')
    })

    it('should create a user', async () => {
        const user = { id: '1' }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: user })
        const result = await partnerCenter.createCustomerUser('1', {
            id: '1',
        } as never)
        expect(result).toEqual(user)
        expect(mockAxios.post).toHaveBeenCalledWith('/customers/1/users', {
            id: '1',
        })
    })

    it('should set user role', async () => {
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: {} })
        const result = await partnerCenter.setCustomerUserRole('1', '1', {
            Id: '1',
            DisplayName: 'test',
            UserPrincipalName: 'test',
        })
        expect(result).toEqual({})
        expect(mockAxios.post).toHaveBeenCalledWith('/customers/1/directoryroles/1/usermembers', {
            Id: '1',
            DisplayName: 'test',
            UserPrincipalName: 'test',
        })
    })

    it('should get user roles', async () => {
        const roles = [{ id: '1' }, { id: '2' }]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: roles } })
        const result = await partnerCenter.getCustomerUserRoles('roleId', 'userId')
        expect(result).toEqual(roles)
        expect(mockAxios.get).toHaveBeenCalledWith('/customers/roleId/users/userId/directoryroles')
    })

    it('should get all users', async () => {
        const users = [{ id: '1' }, { id: '2' }]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { items: users } })
        const result = await partnerCenter.getAllCustomerUsers('1')
        expect(result).toEqual(users)
        expect(mockAxios.get).toHaveBeenCalledWith('/customers/1/users')
    })

    it('should get user by id', async () => {
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { id: '1' } })
        const result = await partnerCenter.getCustomerUserById('1', '1')
        expect(result).toEqual({ id: '1' })
        expect(mockAxios.get).toHaveBeenCalledWith('/customers/1/users/1')
    })

    it('should get price sheet', async () => {
        // Mock the TokenManager
        const mockTokenManager = {
            authenticate: jest.fn().mockResolvedValue({
                access_token: 'mock-access-token',
            }),
        } as unknown as TokenManager
        ;(partnerCenter as any).tokenManager = mockTokenManager

        const mockBinaryData = Buffer.from('mock price sheet data')

        jest.spyOn(mockAxios, 'get').mockResolvedValue({
            data: mockBinaryData,
            headers: { 'content-type': 'application/octet-stream' },
        })

        const result = await partnerCenter.getPriceSheet()

        expect(Buffer.isBuffer(result)).toBe(true)
        expect(result.toString()).toBe('mock price sheet data')

        expect(mockAxios.get).toHaveBeenCalledWith(
            "https://api.partner.microsoft.com/v1.0/sales/pricesheets(Market='US',PricesheetView='updatedlicensebased')/$value",
            {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: 'Bearer mock-access-token',
                    'Accept-Encoding': 'deflate',
                },
            },
        )

        expect(mockTokenManager.authenticate).toHaveBeenCalledWith(
            'https://api.partner.microsoft.com',
        )
    })
})
