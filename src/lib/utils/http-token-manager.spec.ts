import { initializeHttpAndTokenManager } from './http-token-manager'
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
        const { agent } = initializeHttpAndTokenManager(conf)
        instance = agent
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
