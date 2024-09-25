import { AxiosInstance } from 'axios'
import { Domain, DomainDnsRecord } from '../../types'

export class Domains {
    constructor(private readonly http: AxiosInstance) {}

    /**
     * Create a new domain
     * https://learn.microsoft.com/en-us/graph/api/domain-post-domains?view=graph-rest-1.0&tabs=http
     * @param domainName The fully qualified name of the domain
     * @returns The created Domain object
     */
    async createDomain(domainName: string): Promise<Domain> {
        const { data } = await this.http.post('/domains', { id: domainName })
        return data
    }

    /**
     * List all domains
     * https://learn.microsoft.com/en-us/graph/api/domain-list?view=graph-rest-1.0&tabs=http
     * @returns An array of Domain objects
     */
    async getAllDomains(): Promise<Domain[]> {
        const { data } = await this.http.get('/domains')
        return data.value
    }

    /**
     * Get a specific domain
     * https://learn.microsoft.com/en-us/graph/api/domain-get?view=graph-rest-1.0&tabs=http
     * @param domainId The domain ID (which is the fully qualified domain name)
     * @returns The Domain object
     */
    async getDomain(domainId: string): Promise<Domain> {
        const { data } = await this.http.get(`/domains/${domainId}`)
        return data
    }

    /**
     * Update a domain
     * https://learn.microsoft.com/en-us/graph/api/domain-update?view=graph-rest-1.0&tabs=http
     * @param domainId The domain ID (which is the fully qualified domain name)
     * @param updateData The data to update on the domain
     * @returns The updated Domain object
     */
    async updateDomain(domainId: string, updateData: Partial<Domain>): Promise<Domain> {
        const { data } = await this.http.patch(`/domains/${domainId}`, updateData)
        return data
    }

    /**
     * Delete a domain
     * https://learn.microsoft.com/en-us/graph/api/domain-delete?view=graph-rest-1.0&tabs=http
     * @param domainId The domain ID (which is the fully qualified domain name)
     */
    async deleteDomain(domainId: string): Promise<void> {
        return this.http.delete(`/domains/${domainId}`)
    }

    /**
     * Verify a domain
     * https://learn.microsoft.com/en-us/graph/api/domain-verify?view=graph-rest-1.0&tabs=http
     * @param domainId The domain ID (which is the fully qualified domain name)
     * @returns The verified Domain object
     */
    async verifyDomain(domainId: string): Promise<Domain> {
        const { data } = await this.http.post(`/domains/${domainId}/verify`)
        return data
    }

    /**
     * Get verification DNS records for a domain
     * https://learn.microsoft.com/en-us/graph/api/domain-list-verificationdnsrecords?view=graph-rest-1.0&tabs=http
     * @param domainId The domain ID (which is the fully qualified domain name)
     * @returns An array of DomainDnsRecord objects
     */
    async getDomainVerificationDnsRecords(domainId: string): Promise<DomainDnsRecord[]> {
        const { data } = await this.http.get(`/domains/${domainId}/verificationDnsRecords`)
        return data.value
    }
}
