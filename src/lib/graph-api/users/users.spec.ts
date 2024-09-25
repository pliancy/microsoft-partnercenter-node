import { Users } from './users'
import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'

describe('Users', () => {
    let users: Users

    beforeEach(() => (users = new Users(mockAxios as unknown as AxiosInstance)))

    afterEach(() => mockAxios.reset())

    it('creates an instance of Users', () => expect(users).toBeTruthy())

    describe('get', () => {
        it('gets a user by id or userPrincipalName', async () => {
            const data = { id: 'id', userPrincipalName: 'userPrincipalName' }
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data })
            await expect(users.get('id')).resolves.toEqual(data)
            expect(mockAxios.get).toHaveBeenCalledWith('users/id')
        })
    })

    describe('assignManager', () => {
        it('throws an error given user is not found', async () => {
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: null })
            try {
                await users.assignManager('user', 'manager')
                expect(true).toBe(false)
            } catch (error: any) {
                expect(error.message).toEqual(
                    `Attempted to assign user's manager, but no user was found with userPrincipalName "user"`,
                )
            }
        })

        it('throws an error given manager is not found', async () => {
            jest.spyOn(mockAxios, 'get')
                .mockResolvedValueOnce({ data: { id: 'userId' } })
                .mockResolvedValueOnce({ data: null })
            try {
                await users.assignManager('user', 'manager')
                expect(true).toBe(false)
            } catch (error: any) {
                expect(error.message).toEqual(
                    `Attempted to assign manager as user's manager, but no user was found with userPrincipalName "manager"`,
                )
            }
        })

        it('assigns a manager', async () => {
            jest.spyOn(mockAxios, 'get')
                .mockResolvedValueOnce({ data: { id: 'userId' } })
                .mockResolvedValueOnce({ data: { id: 'managerId' } })
            jest.spyOn(mockAxios, 'put').mockResolvedValue({ status: 204 })
            await users.assignManager('user', 'manager')
            expect(mockAxios.put).toHaveBeenCalledWith('users/userId/manager/$ref', {
                '@odata.id': 'https://graph.microsoft.com/v1.0/users/managerId',
            })
        })
    })
})
