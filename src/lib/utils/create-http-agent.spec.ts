import { createHttpAgent } from './create-http-agent'
import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'

describe('HttpAgent', () => {
    let instance: AxiosInstance

    const conf = {
        partnerDomain: 'test',
        authentication: {
            clientId: 'test',
            clientSecret: 'test',
        },
    }

    beforeEach(() => {
        instance = createHttpAgent(conf)
        jest.spyOn(mockAxios, 'create')
    })

    afterEach(() => {
        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: 'https://api.partnercenter.microsoft.com/v1/',
        })
    })

    it('creates an axios instance', () => {
        expect(instance).toBeTruthy()
    })
})
