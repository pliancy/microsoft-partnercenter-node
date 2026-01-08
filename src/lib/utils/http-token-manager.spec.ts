import { initializeHttpAndTokenManager } from './http-token-manager'
import mockAxios from 'jest-mock-axios'
import axios, { AxiosInstance } from 'axios'
import { decode } from 'jsonwebtoken'

jest.mock('axios', () => {
    return {
        create: () => {
            return {
                post: jest.fn(),
                get: jest.fn(),
                interceptors: {
                    request: { eject: jest.fn(), use: jest.fn() },
                    response: { eject: jest.fn(), use: jest.fn() },
                },
            }
        },
        post: jest.fn(),
        get: jest.fn(),
    }
})

jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'),
    decode: jest.fn(),
}))

describe('HttpAgent', () => {
    let instance: AxiosInstance
    let tokenManager: any

    const conf = {
        partnerDomain: 'test',
        authentication: {
            clientId: 'test',
            clientSecret: 'test',
        },
    }

    beforeEach(() => {
        jest.resetAllMocks()
        const { agent, tokenManager: _tokenManager } = initializeHttpAndTokenManager(
            conf,
            'baseUrl',
            'https://api.partner.microsoft.com/.default',
        )
        instance = agent
        tokenManager = _tokenManager
        jest.spyOn(mockAxios, 'create')
    })

    it('creates an axios instance', () => {
        expect(instance).toBeTruthy()
    })

    it('should authenticate and set a new token', async () => {
        jest.spyOn(axios, 'post').mockResolvedValue({
            data: {
                access_token: 'newAccessToken',
                refresh_token: 'newRefreshToken',
            },
        })

        await tokenManager.getAccessToken()

        expect(tokenManager.getAccessToken()).resolves.toBe('newAccessToken')
    })

    it('should re-auth when token is expired', async () => {
        tokenManager.accessToken = 'invalidToken'
        ;(decode as jest.Mock).mockImplementation((token) => {
            if (token === 'validToken') {
                return { userId: '123', exp: Date.now() / 1000 + 3600 }
            }
            return {
                userId: '123',
                exp: Date.now() / 1000 - 3600,
            }
        })

        jest.spyOn(axios, 'post').mockResolvedValue({
            data: {
                access_token: 'validAccessToken',
                refresh_token: 'newRefreshToken',
            },
        })

        await tokenManager.getAccessToken()
        expect(tokenManager.getAccessToken()).resolves.toBe('validAccessToken')
    })
})
