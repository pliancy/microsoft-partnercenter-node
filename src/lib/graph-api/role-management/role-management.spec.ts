import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'
import { RoleManagement } from './role-management'

describe('RoleManagement', () => {
    let roleManagement: RoleManagement

    beforeEach(() => {
        roleManagement = new RoleManagement(mockAxios as never as AxiosInstance)
    })

    afterEach(() => {
        mockAxios.reset()
    })

    describe('getDirectoryRoleAssignments', () => {
        const principalId = 'sp-object-id'
        const roleDefinitionId = '29232cdf-9323-42fd-ade2-1d097af3e4de'

        it('should return existing role assignments for the principal and role', async () => {
            const mockAssignments = [
                { id: 'ra-1', principalId, roleDefinitionId, directoryScopeId: '/' },
            ]
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { value: mockAssignments } })

            const result = await roleManagement.getDirectoryRoleAssignments(
                principalId,
                roleDefinitionId,
            )

            expect(result).toEqual(mockAssignments)
            expect(mockAxios.get).toHaveBeenCalledWith(
                `roleManagement/directory/roleAssignments?$filter=principalId eq '${principalId}' and roleDefinitionId eq '${roleDefinitionId}'`,
            )
        })

        it('should return an empty array when no assignments exist', async () => {
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { value: [] } })

            const result = await roleManagement.getDirectoryRoleAssignments(
                principalId,
                roleDefinitionId,
            )

            expect(result).toEqual([])
        })
    })

    describe('grantDirectoryRoleAssignment', () => {
        const principalId = 'sp-object-id'
        const roleDefinitionId = '29232cdf-9323-42fd-ade2-1d097af3e4de'

        it('should post a new directory role assignment with correct body', async () => {
            const mockAssignment = {
                id: 'ra-1',
                principalId,
                roleDefinitionId,
                directoryScopeId: '/',
            }
            jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: mockAssignment })

            const result = await roleManagement.grantDirectoryRoleAssignment(
                principalId,
                roleDefinitionId,
            )

            expect(result).toEqual(mockAssignment)
            expect(mockAxios.post).toHaveBeenCalledWith(
                'roleManagement/directory/roleAssignments',
                {
                    '@odata.type': '#microsoft.graph.unifiedRoleAssignment',
                    roleDefinitionId,
                    principalId,
                    directoryScopeId: '/',
                },
            )
        })
    })
})
