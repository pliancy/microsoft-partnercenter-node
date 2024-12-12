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
    })
})
