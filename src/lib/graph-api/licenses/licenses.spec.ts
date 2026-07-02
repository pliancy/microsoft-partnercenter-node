import { Licenses } from './licenses'
import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'
import { GraphUserAssignedLicense, SubscribedSku } from './licenses.types'

describe('Licenses', () => {
    let licenses: Licenses

    beforeEach(() => (licenses = new Licenses(mockAxios as unknown as AxiosInstance)))

    afterEach(() => mockAxios.reset())

    it('creates an instance of Licenses', () => expect(licenses).toBeTruthy())

    describe('getUserLicenses', () => {
        it('gets all user licenses', async () => {
            const mockUserLicenses: GraphUserAssignedLicense[] = [
                {
                    id: 'user1',
                    userPrincipalName: 'user1@test.com',
                    displayName: 'User 1',
                    assignedLicenses: [
                        {
                            skuId: 'sku1',
                            disabledPlans: [],
                        },
                    ],
                },
            ]

            jest.spyOn(mockAxios, 'get').mockResolvedValue({
                data: { value: mockUserLicenses },
            })

            await expect(licenses.getUserLicenses()).resolves.toEqual(mockUserLicenses)
            expect(mockAxios.get).toHaveBeenCalledWith(
                'users?$select=id,userPrincipalName,assignedLicenses,displayName',
            )
        })

        it('gets user licenses from all pages', async () => {
            const firstPage: GraphUserAssignedLicense[] = [
                {
                    id: 'user1',
                    userPrincipalName: 'user1@test.com',
                    displayName: 'User 1',
                    assignedLicenses: [],
                },
            ]
            const secondPage: GraphUserAssignedLicense[] = [
                {
                    id: 'user2',
                    userPrincipalName: 'user2@test.com',
                    displayName: 'User 2',
                    assignedLicenses: [
                        {
                            skuId: 'sku1',
                            disabledPlans: [],
                        },
                    ],
                },
            ]
            const nextLink =
                'https://graph.microsoft.com/v1.0/users?$select=id,userPrincipalName,assignedLicenses,displayName&$skiptoken=abc'

            jest.spyOn(mockAxios, 'get')
                .mockResolvedValueOnce({
                    data: {
                        value: firstPage,
                        '@odata.nextLink': nextLink,
                    },
                })
                .mockResolvedValueOnce({
                    data: { value: secondPage },
                })

            await expect(licenses.getUserLicenses()).resolves.toEqual([...firstPage, ...secondPage])
            expect(mockAxios.get).toHaveBeenNthCalledWith(
                1,
                'users?$select=id,userPrincipalName,assignedLicenses,displayName',
            )
            expect(mockAxios.get).toHaveBeenNthCalledWith(2, nextLink)
        })
    })

    describe('getSubscribedSkus', () => {
        it('gets all subscribed SKUs', async () => {
            const mockSkus: SubscribedSku[] = [
                {
                    accountName: 'test-account',
                    skuId: 'sku1',
                    skuPartNumber: 'ENTERPRISEPACK',
                    appliesTo: 'User',
                    capabilityStatus: 'Enabled',
                    consumedUnits: 1,
                    id: 'id1',
                    accountId: 'account1',
                    subscriptionIds: ['sub1'],
                    prepaidUnits: {
                        enabled: 5,
                        suspended: 0,
                        warning: 0,
                        lockedOut: 0,
                    },
                    servicePlans: [
                        {
                            servicePlanId: 'plan1',
                            servicePlanName: 'EXCHANGE_S_ENTERPRISE',
                            provisioningStatus: 'Success',
                            appliesTo: 'User',
                        },
                    ],
                },
            ]

            jest.spyOn(mockAxios, 'get').mockResolvedValue({
                data: { value: mockSkus },
            })

            await expect(licenses.getSubscribedSkus()).resolves.toEqual(mockSkus)
            expect(mockAxios.get).toHaveBeenCalledWith('subscribedSkus')
        })

        it('gets subscribed SKUs from all pages', async () => {
            const firstPage: SubscribedSku[] = [
                {
                    accountName: 'test-account',
                    skuId: 'sku1',
                    skuPartNumber: 'ENTERPRISEPACK',
                    appliesTo: 'User',
                    capabilityStatus: 'Enabled',
                    consumedUnits: 1,
                    id: 'id1',
                    accountId: 'account1',
                    subscriptionIds: ['sub1'],
                    prepaidUnits: {
                        enabled: 5,
                        suspended: 0,
                        warning: 0,
                        lockedOut: 0,
                    },
                    servicePlans: [],
                },
            ]
            const secondPage: SubscribedSku[] = [
                {
                    accountName: 'test-account',
                    skuId: 'sku2',
                    skuPartNumber: 'VISIOCLIENT',
                    appliesTo: 'User',
                    capabilityStatus: 'Enabled',
                    consumedUnits: 1,
                    id: 'id2',
                    accountId: 'account1',
                    subscriptionIds: ['sub2'],
                    prepaidUnits: {
                        enabled: 5,
                        suspended: 0,
                        warning: 0,
                        lockedOut: 0,
                    },
                    servicePlans: [],
                },
            ]
            const nextLink = 'https://graph.microsoft.com/v1.0/subscribedSkus?$skiptoken=abc'

            jest.spyOn(mockAxios, 'get')
                .mockResolvedValueOnce({
                    data: {
                        value: firstPage,
                        '@odata.nextLink': nextLink,
                    },
                })
                .mockResolvedValueOnce({
                    data: { value: secondPage },
                })

            await expect(licenses.getSubscribedSkus()).resolves.toEqual([
                ...firstPage,
                ...secondPage,
            ])
            expect(mockAxios.get).toHaveBeenNthCalledWith(1, 'subscribedSkus')
            expect(mockAxios.get).toHaveBeenNthCalledWith(2, nextLink)
        })
    })
})
