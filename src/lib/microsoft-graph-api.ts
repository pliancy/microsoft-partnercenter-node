import { MicrosoftApiBase } from './microsoft-api-base'
import { IPartnerCenterConfig } from './types'
import {
    CreateGDAPAccessAssignment,
    CreateGDAPRelationship,
    GDAPAccessAssignment,
    GDAPRelationship,
    GDAPRelationshipRequest,
    GDAPRelationshipRequestAction,
    UpdateGDAPAccessAssignment,
} from './types/gdap.types'

export class MicrosoftGraphApi extends MicrosoftApiBase {
    constructor(config: IPartnerCenterConfig) {
        super(config, 'https://graph.microsoft.com/v1.0/', 'https://graph.microsoft.com/.default')
    }

    /**
     * Create a GDAP relationship
     * https://learn.microsoft.com/en-us/graph/api/tenantrelationship-post-delegatedadminrelationships?view=graph-rest-1.0&tabs=http
     * @param data  - The data to create a GDAP relationship
     * @returns
     */
    async createGDAPRelationship(data: CreateGDAPRelationship): Promise<GDAPRelationship> {
        const { data: gdapRelationship } = await this.httpAgent.post(
            '/tenantRelationships/delegatedAdminRelationships',
            data,
        )
        return gdapRelationship
    }

    /**
     * Get all GDAP relationships
     * https://learn.microsoft.com/en-us/graph/api/tenantrelationship-list-delegatedadminrelationships?view=graph-rest-1.0&tabs=http
     * @returns
     */
    async getAllGDAPRelationships(): Promise<GDAPRelationship[]> {
        const { data } = await this.httpAgent.get(
            '/tenantRelationships/delegatedAdminRelationships',
        )
        return data.value
    }

    /**
     *  Get a GDAP relationship
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationship-get?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @returns
     */
    async getGDAPRelationship(gdapRelationshipId: string): Promise<GDAPRelationship> {
        const { data } = await this.httpAgent.get(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}`,
        )
        return data
    }

    /**
     *  Get a GDAP relationship
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationship-get?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @returns
     */
    async getGDAPRelationshipsByCustomerId(customerId: string): Promise<GDAPRelationship[]> {
        const { data } = await this.httpAgent.get(
            '/tenantRelationships/delegatedAdminRelationships',
            {
                params: {
                    $filter: encodeURIComponent(`customer/tenantId eq '${customerId}'`),
                },
                paramsSerializer: (params) => {
                    return Object.entries(params)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&')
                },
            },
        )
        return data.value
    }

    /**
     *  Update a GDAP relationship
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationship-update?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @param data
     * @returns
     */
    async updateGDAPRelationship(
        gdapRelationshipId: string,
        data: Partial<GDAPRelationship>,
    ): Promise<GDAPRelationship> {
        const { data: gdapRelationship } = await this.httpAgent.patch(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}`,
            data,
        )
        return gdapRelationship
    }

    /**
     *  Delete a GDAP relationship
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationship-delete?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @returns
     */
    async deleteGDAPRelationship(gdapRelationshipId: string) {
        await this.httpAgent.delete(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}`,
        )
    }

    /**
     *  Create a GDAP relationship request
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationship-post-requests?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @param data
     * @returns
     */
    async createGDAPRelationshipRequest(
        gdapRelationshipId: string,
        action: GDAPRelationshipRequestAction,
    ): Promise<GDAPRelationshipRequest> {
        const { data: gdapRelationship } = await this.httpAgent.post(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}/requests`,
            {
                action,
            },
        )
        return gdapRelationship
    }

    /**
     *  Get all GDAP relationship requests
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationship-list-requests?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @returns
     */
    async getAllGDAPRelationshipRequests(
        gdapRelationshipId: string,
    ): Promise<GDAPRelationshipRequest[]> {
        const { data } = await this.httpAgent.get(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}/requests`,
        )
        return data.value
    }

    /**
     *  Get a GDAP relationship request
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationshiprequest-get?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @param gdapRelationshipRequestId
     * @returns
     */
    async getGDAPRelationshipRequest(
        gdapRelationshipId: string,
        gdapRelationshipRequestId: string,
    ): Promise<GDAPRelationshipRequest> {
        const { data } = await this.httpAgent.get(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}/requests/${gdapRelationshipRequestId}`,
        )
        return data
    }

    /**
     *  Create a GDAP access assignment
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationship-post-accessassignments?view=graph-rest-1.0&tabs=http
     * @param data
     * @returns
     */
    async createGDAPAccessAssignment(
        gdapRelationshipId: string,
        data: CreateGDAPAccessAssignment,
    ): Promise<GDAPAccessAssignment> {
        const { data: gdapAccessAssignment } = await this.httpAgent.post(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}/accessAssignments`,
            data,
        )
        return gdapAccessAssignment
    }

    /**
     *  Get all GDAP access assignments
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminrelationship-list-accessassignments?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @returns
     */
    async getAllGDAPAccessAssignments(gdapRelationshipId: string): Promise<GDAPAccessAssignment[]> {
        const { data } = await this.httpAgent.get(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}/accessAssignments`,
        )
        return data.value
    }

    /**
     *  Get a GDAP access assignment
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminaccessassignment-get?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @param gdapAccessAssignmentId
     * @returns
     */
    async getGDAPAccessAssignment(
        gdapRelationshipId: string,
        gdapAccessAssignmentId: string,
    ): Promise<GDAPAccessAssignment> {
        const { data } = await this.httpAgent.get(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}/accessAssignments/${gdapAccessAssignmentId}`,
        )
        return data
    }

    /**
     *  Update a GDAP access assignment
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminaccessassignment-update?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @param gdapAccessAssignmentId
     * @param data
     * @returns
     */
    async updateGDAPAccessAssignment(
        gdapRelationshipId: string,
        gdapAccessAssignmentId: string,
        data: UpdateGDAPAccessAssignment,
    ): Promise<GDAPAccessAssignment> {
        const { data: gdapAccessAssignment } = await this.httpAgent.patch(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}/accessAssignments/${gdapAccessAssignmentId}`,
            data,
        )
        return gdapAccessAssignment
    }

    /**
     *  Delete a GDAP access assignment
     * https://learn.microsoft.com/en-us/graph/api/delegatedadminaccessassignment-delete?view=graph-rest-1.0&tabs=http
     * @param gdapRelationshipId
     * @param gdapAccessAssignmentId
     * @returns
     */
    async deleteGDAPAccessAssignment(gdapRelationshipId: string, gdapAccessAssignmentId: string) {
        await this.httpAgent.delete(
            `/tenantRelationships/delegatedAdminRelationships/${gdapRelationshipId}/accessAssignments/${gdapAccessAssignmentId}`,
        )
    }
}
