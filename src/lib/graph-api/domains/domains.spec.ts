import { Domains } from './domains'
import axios, { AxiosInstance } from 'axios'
import { DomainDnsRecord } from '../../types'

describe('Domains', () => {
    let domains: Domains

    const data = { id: 'example.com' }

    beforeEach(() => (domains = new Domains(axios as unknown as AxiosInstance)))

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('creates a domain', async () => {
        jest.spyOn(axios, 'post').mockResolvedValue({ data })
        await expect(domains.createDomain(data.id)).resolves.toEqual(data)
        expect(axios.post).toHaveBeenCalledWith('/domains', data)
    })

    it('gets a domain by id', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue({ data })
        await expect(domains.getDomain(data.id)).resolves.toEqual(data)
        expect(axios.get).toHaveBeenCalledWith(`/domains/${data.id}`)
    })

    it('updates a domain', async () => {
        const update = { id: 'new.example.com' }
        jest.spyOn(axios, 'patch').mockResolvedValue({ data: update })
        await expect(domains.updateDomain(data.id, update)).resolves.toEqual(update)
        expect(axios.patch).toHaveBeenCalledWith(`/domains/${data.id}`, update)
    })

    it('deletes a domain', async () => {
        const res = { status: 204 }
        jest.spyOn(axios, 'delete').mockResolvedValue(res)
        await expect(domains.deleteDomain(data.id)).resolves.toEqual(res)
        expect(axios.delete).toHaveBeenCalledWith(`/domains/${data.id}`)
    })

    it('verifies a domain', async () => {
        jest.spyOn(axios, 'post').mockResolvedValue({ data })
        await expect(domains.verifyDomain(data.id)).resolves.toEqual(data)
        expect(axios.post).toHaveBeenCalledWith(`/domains/${data.id}/verify`)
    })

    it(`verifies a domain's DNS records`, async () => {
        const records = [{ id: 'id', ttl: 3600 }] as DomainDnsRecord[]
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { value: records } })
        await expect(domains.getDomainVerificationDnsRecords(data.id)).resolves.toEqual(records)
        expect(axios.get).toHaveBeenCalledWith(`/domains/${data.id}/verificationDnsRecords`)
    })
})
