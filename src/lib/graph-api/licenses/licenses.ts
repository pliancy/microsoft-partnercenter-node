import { AxiosInstance } from 'axios'
import { GraphUserAssignedLicense, SubscribedSku } from './licenses.types'

export class Licenses {
    constructor(private readonly http: AxiosInstance) {}

    async getUserLicenses(): Promise<GraphUserAssignedLicense[]> {
        const { data: users } = await this.http.get(
            'users?$select=id,userPrincipalName,assignedLicenses',
        )
        return users.value
    }

    async getSubscribedSkus(): Promise<SubscribedSku[]> {
        const { data: users } = await this.http.get('subscribedSkus')
        return users.value
    }
}
