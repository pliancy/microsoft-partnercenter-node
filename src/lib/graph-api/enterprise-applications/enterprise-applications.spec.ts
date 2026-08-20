import axios, { AxiosInstance } from 'axios'
import { EnterpriseApplications } from './enterprise-applications'
import { ServicePrincipal } from './enterprise-applications.types'

describe('EnterpriseApplications', () => {
    let servicePrincipals: EnterpriseApplications

    beforeEach(() => {
        servicePrincipals = new EnterpriseApplications(axios as never as AxiosInstance)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getByAppId', () => {
        const appId = 'test-app-id'

        it('should get a service principal by its appId', async () => {
            const mockSP: ServicePrincipal = {
                id: 'sp-id',
                appId,
                displayName: 'Test App',
            } as ServicePrincipal

            jest.spyOn(axios, 'get').mockResolvedValue({
                data: {
                    value: [mockSP],
                },
            })

            const result = await servicePrincipals.getByAppId(appId)

            expect(result).toEqual(mockSP)
            expect(axios.get).toHaveBeenCalledWith(`servicePrincipals?$filter=appId eq '${appId}'`)
        })

        it('should return null if no service principal is found', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue({
                data: {
                    value: [],
                },
            })

            const result = await servicePrincipals.getByAppId(appId)

            expect(result).toBeNull()
            expect(axios.get).toHaveBeenCalledWith(`servicePrincipals?$filter=appId eq '${appId}'`)
        })

        it('should return null if data value is missing', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue({
                data: {},
            })

            const result = await servicePrincipals.getByAppId(appId)

            expect(result).toBeNull()
        })
    })

    describe('getAppRoleAssignments', () => {
        const principalId = 'sp-id'

        it('should get app role assignments', async () => {
            const mockAssignments = [{ id: 'assignment-1' }, { id: 'assignment-2' }]
            jest.spyOn(axios, 'get').mockResolvedValue({
                data: {
                    value: mockAssignments,
                },
            })

            const result = await servicePrincipals.getAppRoleAssignments(principalId)

            expect(result).toEqual(mockAssignments)
            expect(axios.get).toHaveBeenCalledWith(
                `servicePrincipals/${principalId}/appRoleAssignments`,
            )
        })

        it('should return an empty array if no assignments are found', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue({
                data: {},
            })

            const result = await servicePrincipals.getAppRoleAssignments(principalId)

            expect(result).toEqual([])
        })
    })

    describe('grantAppRoleAssignment', () => {
        it('should grant an app role assignment', async () => {
            const principalId = 'sp-id'
            const resourceId = 'resource-id'
            const appRoleId = 'role-id'

            const mockAssignment = { id: 'assignment-id' }
            jest.spyOn(axios, 'post').mockResolvedValue({ data: mockAssignment })

            const result = await servicePrincipals.grantAppRoleAssignment(
                principalId,
                resourceId,
                appRoleId,
            )

            expect(result).toEqual(mockAssignment)
            expect(axios.post).toHaveBeenCalledWith(
                `servicePrincipals/${principalId}/appRoleAssignments`,
                {
                    principalId,
                    resourceId,
                    appRoleId,
                },
            )
        })
    })
})
