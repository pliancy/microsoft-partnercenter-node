import { AxiosInstance } from 'axios'
import { getPagedGraphCollection } from '../pagination'
import { GraphUserAssignedLicense, SubscribedSku } from './licenses.types'

export class Licenses {
    constructor(private readonly http: AxiosInstance) {}

    async getUserLicenses(): Promise<GraphUserAssignedLicense[]> {
        return getPagedGraphCollection(
            this.http,
            'users?$select=id,userPrincipalName,assignedLicenses,displayName',
        )
    }

    async getSubscribedSkus(): Promise<SubscribedSku[]> {
        return getPagedGraphCollection(this.http, 'subscribedSkus')
    }
}
