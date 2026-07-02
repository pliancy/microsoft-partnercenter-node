import { AxiosInstance } from 'axios'
import { getPagedGraphCollection } from '../pagination'
import { AppRoleAssignment, ServicePrincipal } from './enterprise-applications.types'

export class EnterpriseApplications {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Retrieves a ServicePrincipal object by its application ID.
     *
     * @param {string} appId - The application ID of the ServicePrincipal to retrieve.
     * @return {Promise<ServicePrincipal>} A promise that resolves to the ServicePrincipal object associated with the given appId. Returns null if no matching ServicePrincipal is found.
     */
    async getByAppId(appId: string): Promise<ServicePrincipal | null> {
        const servicePrincipals = await getPagedGraphCollection<ServicePrincipal>(
            this.http,
            `servicePrincipals?$filter=appId eq '${appId}'`,
        )
        return servicePrincipals[0] ?? null
    }

    /**
     * Retrieves the list of app role assignments for a specified principal.
     *
     * @param {string} principalId - The unique identifier of the principal (service principal or user) for which app role assignments are being retrieved.
     * @return {Promise<AppRoleAssignment[]>} A promise that resolves to an array of app role assignments associated with the specified principal.
     */
    async getAppRoleAssignments(principalId: string): Promise<AppRoleAssignment[]> {
        return getPagedGraphCollection(
            this.http,
            `servicePrincipals/${principalId}/appRoleAssignments`,
        )
    }

    /**
     * Assigns an app role to a specified service principal.
     *
     * @param {string} principalId - The unique identifier of the service principal to which the role assignment will be granted.
     * @param {string} resourceId - The identifier of the resource (service principal) that owns the app role being assigned.
     * @param {string} appRoleId - The unique identifier of the app role being assigned.
     * @return {Promise<AppRoleAssignment>} A promise that resolves to an AppRoleAssignment object containing the details of the assignment.
     */
    async grantAppRoleAssignment(
        principalId: string,
        resourceId: string,
        appRoleId: string,
    ): Promise<AppRoleAssignment> {
        const { data: appRoleAssignment } = await this.http.post(
            `servicePrincipals/${principalId}/appRoleAssignments`,
            {
                principalId,
                resourceId,
                appRoleId,
            },
        )
        return appRoleAssignment
    }
}
