import { AxiosInstance, AxiosResponse } from 'axios'
import { GraphUser } from './user.types'

export class Users {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Gets a user by id or userPrincipalNames
     * https://learn.microsoft.com/en-us/graph/api/user-get
     * @param id {id | userPrincipalName}
     */
    async get(id: string): Promise<GraphUser> {
        const { data: user } = await this.http.get(`users/${id}`)
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
        const user = await this.get(userPrincipalName)
        if (!user)
            throw new Error(
                `Attempted to assign ${userPrincipalName}'s manager, but no user was found with ` +
                    `userPrincipalName "${userPrincipalName}"`,
            )

        const manager = await this.get(managerPrincipalName)
        if (!manager)
            throw new Error(
                `Attempted to assign ${managerPrincipalName} as ${userPrincipalName}'s manager, ` +
                    `but no user was found with userPrincipalName "${managerPrincipalName}"`,
            )

        return this.http.put(`users/${user.id}/manager/$ref`, {
            '@odata.id': `https://graph.microsoft.com/v1.0/users/${manager.id}`,
        })
    }
}
