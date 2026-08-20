import { AxiosInstance } from 'axios'
import { getPagedGraphCollection } from '../pagination'
import { UnifiedRoleAssignment } from './role-management.types'

export class RoleManagement {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Retrieves existing directory role assignments for a principal filtered by role definition.
     *
     * @param {string} principalId - The object ID of the service principal.
     * @param {string} roleDefinitionId - The well-known role definition ID to filter by.
     * @return {Promise<UnifiedRoleAssignment[]>} Existing assignments matching the filter.
     */
    async getDirectoryRoleAssignments(
        principalId: string,
        roleDefinitionId: string,
    ): Promise<UnifiedRoleAssignment[]> {
        return getPagedGraphCollection(
            this.http,
            `roleManagement/directory/roleAssignments?$filter=principalId eq '${principalId}' and roleDefinitionId eq '${roleDefinitionId}'`,
        )
    }

    /**
     * Assigns a directory role to a service principal at tenant scope.
     *
     * @param {string} principalId - The object ID of the service principal to assign the role to.
     * @param {string} roleDefinitionId - The well-known role definition ID to assign.
     * @return {Promise<UnifiedRoleAssignment>} The created role assignment.
     */
    async grantDirectoryRoleAssignment(
        principalId: string,
        roleDefinitionId: string,
    ): Promise<UnifiedRoleAssignment> {
        const { data } = await this.http.post('roleManagement/directory/roleAssignments', {
            '@odata.type': '#microsoft.graph.unifiedRoleAssignment',
            roleDefinitionId,
            principalId,
            directoryScopeId: '/',
        })
        return data
    }
}
