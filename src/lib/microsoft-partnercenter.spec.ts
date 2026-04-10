jest.mock('axios')

jest.mock('unzipper', () => {
    const { PassThrough } = require('stream')
    return {
        ParseOne: jest.fn(() => new PassThrough()),
    }
})

import { MicrosoftPartnerCenter } from './microsoft-partnercenter'
import axios from 'axios'
import mockAxios from 'jest-mock-axios'
import { Readable } from 'stream'
import { OrderLineItem } from './types/orders.types'
import { ApplicationConsent } from './types'

describe('Microsoft Partner Center', () => {
    let partnerCenter: MicrosoftPartnerCenter

    const partnerMicrosoftAuth = {
        token_type: 'Bearer',
        expires_in: '3600',
        ext_expires_in: '3600',
        expires_on: '1',
        not_before: '1',
        resource: 'https://api.partner.microsoft.com/',
        access_token: 'test-partner-api-token',
    }

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
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: customers } })
        const result = await partnerCenter.getAllCustomers()
        expect(result).toEqual(customers)
    })

    it('should get all invoices', async () => {
        const invoices = [{ id: '1' }, { id: '2' }]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: invoices } })
        const result = await partnerCenter.getInvoices()
        expect(result).toEqual(invoices)
    })

    it('should get invoice pdf', async () => {
        const pdf = Buffer.from('test')
        jest.spyOn(axios, 'get').mockResolvedValue({ data: pdf })
        const result = await partnerCenter.getInvoicePDF('1')
        expect(result).toEqual(pdf)
    })

    it('should get customer by id', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { id: '1' } })
        const result = await partnerCenter.getCustomerById('1')
        expect(result).toEqual({ id: '1' })
    })

    it('should get customer subscriptions', async () => {
        const subscriptions = [{ id: '1' }, { id: '2' }]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: subscriptions } })
        const result = await partnerCenter.getCustomerSubscriptions('1')
        expect(result).toEqual(subscriptions)
    })

    it('should get customer subscription by id', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { id: '1' } })
        const result = await partnerCenter.getCustomerSubscriptionById('1', '1')
        expect(result).toEqual({ id: '1' })
    })

    it('should get customer subscription by offer id', async () => {
        const subscriptions = [
            { id: '1', offerId: '1' },
            { id: '2', offerId: '2' },
        ]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: subscriptions } })
        const result = await partnerCenter.getCustomerSubscriptionByOfferId('1', '1')
        expect(result).toEqual({ id: '1', offerId: '1' })
    })

    it('should update customer subscription users', async () => {
        const subscription = { id: '1', quantity: 1 }
        jest.spyOn(axios, 'get').mockResolvedValue({ data: subscription })
        jest.spyOn(axios, 'patch').mockResolvedValue({ data: subscription })
        const result = await partnerCenter.updateCustomerSubscriptionUsers('1', '1', 2)
        expect(result).toEqual(subscription)
    })

    it('should create an order', async () => {
        const subscription = { id: '1', quantity: 16 }
        jest.spyOn(axios, 'post').mockResolvedValue({ data: subscription })
        const lineItems: OrderLineItem[] = [
            {
                offerId: '1',
                quantity: 16,
                termDuration: 'P1M',
            },
        ]

        const result = await partnerCenter.createOrder('1', 'monthly', lineItems)
        expect(result).toEqual(subscription)
        expect(axios.post).toHaveBeenCalledWith('/customers/1/orders', {
            lineItems: lineItems.map((item, idx) => ({
                ...item,
                lineItemNumber: idx,
            })),
            billingCycle: 'monthly',
        })
    })

    it('should get skus by customer', async () => {
        const offers = [{ id: '1' }, { id: '2' }]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: offers } })
        const result = await partnerCenter.getSkusByCustomer('1', 'productId')
        expect(result).toEqual(offers)
        expect(axios.get).toHaveBeenCalledWith('/customers/1/products/productId/skus')
    })

    it('should get availabilities by customer', async () => {
        const offers = [{ id: '1' }, { id: '2' }]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: offers } })
        const result = await partnerCenter.getAvailabilitiesByCustomer('1', 'productId', 'skuId')
        expect(result).toEqual(offers)
        expect(axios.get).toHaveBeenCalledWith(
            '/customers/1/products/productId/skus/skuId/availabilities',
        )
    })

    it('should create an order by product id', async () => {
        const subscription = { id: '1', quantity: 16 }
        jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { items: [{ id: 'skuId' }] } })
        jest.spyOn(axios, 'get').mockResolvedValueOnce({
            data: { items: [{ id: 'availabilityId' }] },
        })
        jest.spyOn(axios, 'post').mockResolvedValue({ data: subscription })

        const lineItems: OrderLineItem[] = [
            {
                offerId: 'productId:skuId:availabilityId',
                quantity: 16,
            },
        ]

        const result = await partnerCenter.createOrderByProductId('1', 'productId', 16, 'monthly')
        expect(result).toEqual(subscription)
        expect(axios.post).toHaveBeenCalledWith('/customers/1/orders', {
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
        jest.spyOn(axios, 'post').mockResolvedValue({ data: consent })
        const result = await partnerCenter.createApplicationConsent('1', consent)
        expect(result).toEqual(consent)
        expect(axios.post).toHaveBeenCalledWith('/customers/1/applicationconsents', consent)
    })

    it('should remove an application consent', async () => {
        jest.spyOn(axios, 'delete').mockResolvedValue({ data: {} })
        const result = await partnerCenter.removeApplicationConsent('1', '1')
        expect(result).toBeUndefined()
        expect(axios.delete).toHaveBeenCalledWith('/customers/1/applicationconsents/1')
    })

    it('should get license usage by customer', async () => {
        const licenses = [{ id: '1' }, { id: '2' }]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: licenses } })
        const result = await partnerCenter.getCustomerLicenseUsage('1')
        expect(result).toEqual(licenses)
        expect(axios.get).toHaveBeenCalledWith('/customers/1/subscribedskus')
    })

    it('should create a customer', async () => {
        const customer = { id: '1' }
        jest.spyOn(axios, 'post').mockResolvedValue({ data: customer })
        const result = await partnerCenter.createCustomer({ id: '1' } as never)
        expect(result).toEqual(customer)
        expect(axios.post).toHaveBeenCalledWith('/customers', { id: '1' })
    })

    it('should delete a customer user', async () => {
        jest.spyOn(axios, 'delete').mockResolvedValue({ data: {} })
        const result = await partnerCenter.deleteCustomerUser('1', '1')
        expect(result).toBeUndefined()
        expect(axios.delete).toHaveBeenCalledWith('/customers/1/users/1')
    })

    it('should create a user', async () => {
        const user = { id: '1' }
        jest.spyOn(axios, 'post').mockResolvedValue({ data: user })
        const result = await partnerCenter.createCustomerUser('1', {
            id: '1',
        } as never)
        expect(result).toEqual(user)
        expect(axios.post).toHaveBeenCalledWith('/customers/1/users', {
            id: '1',
        })
    })

    it('should set user role', async () => {
        jest.spyOn(axios, 'post').mockResolvedValue({ data: {} })
        const result = await partnerCenter.setCustomerUserRole('1', '1', {
            Id: '1',
            DisplayName: 'test',
            UserPrincipalName: 'test',
        })
        expect(result).toEqual({})
        expect(axios.post).toHaveBeenCalledWith('/customers/1/directoryroles/1/usermembers', {
            Id: '1',
            DisplayName: 'test',
            UserPrincipalName: 'test',
        })
    })

    it('should get user roles', async () => {
        const roles = [{ id: '1' }, { id: '2' }]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: roles } })
        const result = await partnerCenter.getCustomerUserRoles('roleId', 'userId')
        expect(result).toEqual(roles)
        expect(axios.get).toHaveBeenCalledWith('/customers/roleId/users/userId/directoryroles')
    })

    it('should get all users', async () => {
        const users = [{ id: '1' }, { id: '2' }]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { items: users } })
        const result = await partnerCenter.getAllCustomerUsers('1')
        expect(result).toEqual(users)
        expect(axios.get).toHaveBeenCalledWith('/customers/1/users')
    })

    it('should get user by id', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { id: '1' } })
        const result = await partnerCenter.getCustomerUserById('1', '1')
        expect(result).toEqual({ id: '1' })
        expect(axios.get).toHaveBeenCalledWith('/customers/1/users/1')
    })

    describe('getPriceSheet', () => {
        it('should fail given an unknown price sheet type', async () => {
            jest.spyOn(axios, 'get')

            await expect(partnerCenter.getPriceSheet('bad' as never)).rejects.toThrow(
                'Unknown price sheet type: bad. Allowed values are: nce, legacy, eos.',
            )

            expect(axios.get).not.toHaveBeenCalled()
        })

        it('should authenticate, fetch NCE stream, and return parsed CSV rows', async () => {
            const authenticate = jest
                .spyOn((partnerCenter as any).tokenManager, 'authenticate')
                .mockResolvedValue(partnerMicrosoftAuth)
            const csvContent = 'OfferId,Price\nO1,99\n'
            jest.spyOn(axios, 'get').mockResolvedValue({ data: Readable.from([csvContent]) })

            const result = await partnerCenter.getPriceSheet('nce')

            expect(authenticate).toHaveBeenCalledWith('https://api.partner.microsoft.com/.default')
            expect(axios.get).toHaveBeenCalledWith(
                "https://api.partner.microsoft.com/v1.0/sales/pricesheets(Market='US',PricesheetView='updatedlicensebased')/$value",
                expect.objectContaining({
                    responseType: 'stream',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-partner-api-token',
                    }),
                }),
            )
            expect(result).toEqual([{ OfferId: 'O1', Price: '99' }])
        })

        it('should use legacy pricesheet view', async () => {
            jest.spyOn((partnerCenter as any).tokenManager, 'authenticate').mockResolvedValue(
                partnerMicrosoftAuth,
            )
            jest.spyOn(axios, 'get').mockResolvedValue({ data: Readable.from(['Id\n1\n']) })

            await partnerCenter.getPriceSheet('legacy')

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("PricesheetView='licensebasedest'"),
                expect.any(Object),
            )
        })

        it('should use EOS pricesheet view', async () => {
            jest.spyOn((partnerCenter as any).tokenManager, 'authenticate').mockResolvedValue(
                partnerMicrosoftAuth,
            )
            jest.spyOn(axios, 'get').mockResolvedValue({ data: Readable.from(['Id\n1\n']) })

            await partnerCenter.getPriceSheet('eos')

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("PricesheetView='licensebasedeos'"),
                expect.any(Object),
            )
        })
    })

    describe('getOfferMatrix', () => {
        beforeEach(() => {
            jest.useFakeTimers()
            jest.setSystemTime(new Date('2026-04-10T12:00:00.000Z'))
        })

        afterEach(() => {
            jest.useRealTimers()
        })

        it('should authenticate, fetch current month offer matrix stream, and return parsed CSV rows', async () => {
            const authenticate = jest
                .spyOn((partnerCenter as any).tokenManager, 'authenticate')
                .mockResolvedValue(partnerMicrosoftAuth)
            const csvContent = 'Sku,Revenue\nS1,5\n'
            jest.spyOn(axios, 'get').mockResolvedValue({ data: Readable.from([csvContent]) })

            const result = await partnerCenter.getOfferMatrix()

            expect(authenticate).toHaveBeenCalledWith('https://api.partner.microsoft.com/.default')
            expect(axios.get).toHaveBeenCalledWith(
                "https://api.partner.microsoft.com/v1.0/sales/offermatrix(Month='202604')/$value",
                expect.objectContaining({
                    responseType: 'stream',
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-partner-api-token',
                    }),
                }),
            )
            expect(result).toEqual([{ Sku: 'S1', Revenue: '5' }])
        })
    })

    describe('getPlanIdentifiers', () => {
        it('should download plan identifier CSV and return parsed rows', async () => {
            jest.mocked(axios).mockResolvedValue({
                data: 'Product,ServicePlan\nProd1,plan-a\n',
            })

            const result = await partnerCenter.getPlanIdentifiers()

            expect(axios).toHaveBeenCalledWith({
                method: 'get',
                url: 'https://download.microsoft.com/download/e/3/e/e3e9faf2-f28b-490a-9ada-c6089a1fc5b0/Product%20names%20and%20service%20plan%20identifiers%20for%20licensing.csv',
                headers: {
                    Accept: 'text/csv',
                },
            })
            expect(result).toEqual([{ Product: 'Prod1', ServicePlan: 'plan-a' }])
        })
    })
})
