import { AxiosInstance, AxiosResponse } from 'axios'
import { GraphUser } from './user.types'

export class Users {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Gets a user by id or userPrincipalName
     * https://learn.microsoft.com/en-us/graph/api/user-get
     * @param id {id | userPrincipalName}
     */
    async get(id: string): Promise<GraphUser> {
        const { data: user } = await this.http.get(`users/${id}`)
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
