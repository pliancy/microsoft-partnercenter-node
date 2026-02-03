import { Applications } from './applications'
import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'

describe('Applications', () => {
    let applications: Applications

    beforeEach(() => (applications = new Applications(mockAxios as unknown as AxiosInstance)))

    afterEach(() => mockAxios.reset())

    it('creates an instance of Applications', () => expect(applications).toBeTruthy())

    describe('getById', () => {
        it('should fetch an application by appId', async () => {
            const mockApp = { id: 'app-id', displayName: 'Test App' }
            const promise = applications.getById('app-id')

            expect(mockAxios.get).toHaveBeenCalledWith(`applications(appId='app-id')`)

            mockAxios.mockResponse({ data: mockApp })

            const result = await promise
            expect(result).toEqual(mockApp)
        })
    })

    describe('getAppRoles', () => {
        it('should fetch app permissions and map them correctly', async () => {
            const mockApp = {
                requiredResourceAccess: [
                    {
                        resourceAppId: 'resource-1',
                        resourceAccess: [
                            { id: 'perm-1', type: 'Role' },
                            { id: 'perm-2', type: 'Scope' },
                        ],
                    },
                ],
            }

            const mockSP = {
                displayName: 'Resource 1',
                appRoles: [{ id: 'perm-1', value: 'Role.Read' }],
                oauth2PermissionScopes: [{ id: 'perm-2', value: 'Scope.Write' }],
            }

            const promise = applications.getAppPermissions('app-id')

            // First call to getById
            mockAxios.mockResponse({ data: mockApp })

            // Wait for next tick to let getAppRoles proceed to SP fetch
            await new Promise((resolve) => setImmediate(resolve))

            expect(mockAxios.get).toHaveBeenCalledWith(
                `servicePrincipals?$filter=appId eq 'resource-1'&$select=id,displayName,appRoles,oauth2PermissionScopes`,
            )

            mockAxios.mockResponse({
                data: {
                    value: [mockSP],
                },
            })

            const result = await promise

            expect(result).toEqual([
                {
                    role: 'Resource 1',
                    permissions: [
                        { name: 'Role.Read', type: 'Application' },
                        { name: 'Scope.Write', type: 'Delegated' },
                    ],
                },
            ])
        })

        it('should throw error if SP is not found', async () => {
            const mockApp = {
                requiredResourceAccess: [
                    {
                        resourceAppId: 'resource-missing',
                        resourceAccess: [{ id: 'perm-1', type: 'Role' }],
                    },
                ],
            }

            const promise = applications.getAppPermissions('app-id')

            mockAxios.mockResponse({ data: mockApp })

            await new Promise((resolve) => setImmediate(resolve))

            mockAxios.mockResponse({
                data: {
                    value: [],
                },
            })

            await expect(promise).rejects.toThrow(
                'Service Principal not found for resourceAppId: resource-missing',
            )
        })

        it('should use permission id as name if definition is not found in SP', async () => {
            const mockApp = {
                requiredResourceAccess: [
                    {
                        resourceAppId: 'resource-1',
                        resourceAccess: [{ id: 'unknown-perm', type: 'Role' }],
                    },
                ],
            }

            const mockSP = {
                displayName: 'Resource 1',
                appRoles: [],
            }

            const promise = applications.getAppPermissions('app-id')

            mockAxios.mockResponse({ data: mockApp })

            await new Promise((resolve) => setImmediate(resolve))

            mockAxios.mockResponse({
                data: {
                    value: [mockSP],
                },
            })

            const result = await promise

            expect(result).toEqual([
                {
                    role: 'Resource 1',
                    permissions: [{ name: 'unknown-perm', type: 'Application' }],
                },
            ])
        })

        it('should handle multiple resources', async () => {
            const mockApp = {
                requiredResourceAccess: [
                    {
                        resourceAppId: 'res-1',
                        resourceAccess: [{ id: 'p1', type: 'Role' }],
                    },
                    {
                        resourceAppId: 'res-2',
                        resourceAccess: [{ id: 'p2', type: 'Scope' }],
                    },
                ],
            }

            const mockSP1 = { displayName: 'SP 1', appRoles: [{ id: 'p1', value: 'P1' }] }
            const mockSP2 = {
                displayName: 'SP 2',
                oauth2PermissionScopes: [{ id: 'p2', value: 'P2' }],
            }

            const promise = applications.getAppPermissions('app-id')

            // getById
            mockAxios.mockResponse({ data: mockApp })

            await new Promise((resolve) => setImmediate(resolve))

            // Two SP calls are made in parallel
            expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining("appId eq 'res-1'"))
            expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining("appId eq 'res-2'"))

            // Respond to both
            mockAxios.mockResponse({ data: { value: [mockSP1] } })
            mockAxios.mockResponse({ data: { value: [mockSP2] } })

            const result = await promise

            expect(result).toHaveLength(2)
            expect(result).toContainEqual({
                role: 'SP 1',
                permissions: [{ name: 'P1', type: 'Application' }],
            })
            expect(result).toContainEqual({
                role: 'SP 2',
                permissions: [{ name: 'P2', type: 'Delegated' }],
            })
        })
    })
})
