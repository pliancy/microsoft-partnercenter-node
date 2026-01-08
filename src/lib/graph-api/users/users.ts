import { AxiosInstance, AxiosResponse } from 'axios'
import { GraphUser, GraphUserDefaultProperties } from './user.types'

export class Users {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Gets a user by id or userPrincipalName
     * https://learn.microsoft.com/en-us/graph/api/user-get
     * @param id {id | userPrincipalName}
     * @param additionalProperties (keyof GraphUser)[]
     * @param expandProperties this can be either a string (keyof GraphUser) or a function format,
     * ($select/$expand), e.g., 'manager($select=id,userPrincipalName)'
     */
    async get(
        id: string,
        additionalProperties: (keyof GraphUser)[] = [],
        expandProperties: (keyof GraphUser | string)[] = [],
    ): Promise<GraphUser> {
        let url = `users/${id}?$select=${GraphUserDefaultProperties.join(',')}`
        if (additionalProperties.length) {
            // The leading comma continues the defaultProperties string
            url += `,${additionalProperties.join(',')}`
        }

        if (expandProperties.length) {
            url += `&$expand=${expandProperties.join(',')}`
        }

        const { data: user } = await this.http.get(url)
        return user
    }

    /**
     * Creates a new user in the system and optionally assigns a manager to the user.
     *
     * @param {Omit<GraphUser, 'id'>} data - The user data required for creation. If a manager is included, it will be validated and assigned to the user.
     * @return {Promise<GraphUser>} A promise resolving to the created user object.
     * @throws {Error} If a manager's userPrincipalName is provided but does not exist in the system.
     */
    async create(data: Omit<GraphUser, 'id'>): Promise<GraphUser> {
        const { data: user } = await this.http.post('users', data)
        return user
    }

    /**
     * Updates a GraphUser with the provided data. If a manager is specified in the data,
     * it will handle assigning or removing the manager as appropriate.
     *
     * @param {string} id - The unique identifier of the user to update.
     * @param {Partial<GraphUser>} data - The data to update the user with. Contains attributes
     * to modify, including the manager information if applicable.
     * @return {Promise<GraphUser>} A promise that resolves to the updated GraphUser object.
     */
    async update(id: string, data: Partial<GraphUser>): Promise<GraphUser> {
        const { data: user } = await this.http.patch(`users/${id}`, data)
        return user
    }

    /**
     * Gets a user's by user's id or userPrincipalName
     * https://learn.microsoft.com/en-us/graph/api/user-list-manager
     * @param userPrincipalName
     */
    async getManager(userPrincipalName: string): Promise<GraphUser> {
        const { data: user } = await this.http.get(`users/${userPrincipalName}/manager`)
        return user
    }

    /**
     * Assigns a user's manager
     * https://learn.microsoft.com/en-us/graph/api/user-post-manager
     * @param userPrincipalName
     * @param managerPrincipalName
     */
    async assignManager(
        userPrincipalName: string,
        managerPrincipalName: string,
    ): Promise<AxiosResponse<{ status: 204; data: void }>> {
        let user: GraphUser
        let manager: GraphUser

        try {
            user = await this.get(userPrincipalName)
        } catch (e: any) {
            throw new Error(
                `${e.message}: Attempted to assign ${userPrincipalName}'s manager, but no user was found with ` +
                    `userPrincipalName "${userPrincipalName}"`,
            )
        }

        try {
            manager = await this.get(managerPrincipalName)
        } catch (e: any) {
            throw new Error(
                `${e.message}: Attempted to assign ${managerPrincipalName} as ${userPrincipalName}'s manager, ` +
                    `but no user was found with userPrincipalName "${managerPrincipalName}"`,
            )
        }

        return this.http.put(`users/${user.id}/manager/$ref`, {
            '@odata.id': `https://graph.microsoft.com/v1.0/users/${manager.id}`,
        })
    }

    /**
     * Removes a user's manager
     * https://learn.microsoft.com/en-us/graph/api/user-delete-manager
     * @param userPrincipalName
     */
    async removeManager(
        userPrincipalName: string,
    ): Promise<AxiosResponse<{ status: 204; data: void }>> {
        let user: GraphUser

        try {
            user = await this.get(userPrincipalName)
        } catch (e: any) {
            throw new Error(
                `${e.message}: Attempted to remove ${userPrincipalName}'s manager, but no user was found with ` +
                    `userPrincipalName "${userPrincipalName}"`,
            )
        }

        return this.http.delete(`users/${user.id}/manager/$ref`)
    }
}
