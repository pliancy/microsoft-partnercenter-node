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

    describe('getManager', () => {
        it(`gets a user's manager by user's userPrincipalName`, async () => {
            const user = { id: 'id', userPrincipalName: 'userPrincipalName' }
            const manager = { id: 'id', userPrincipalName: 'managerPrincipalName' }
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: manager })
            await expect(users.getManager(user.userPrincipalName)).resolves.toEqual(manager)
            expect(mockAxios.get).toHaveBeenCalledWith(`users/${user.userPrincipalName}/manager`)
        })
    })

    describe('assignManager', () => {
        it('throws an error given user is not found', async () => {
            const err = new Error('resource not found')
            jest.spyOn(mockAxios, 'get').mockRejectedValue(err)
            try {
                await users.assignManager('user', 'manager')
                expect(true).toBe(false)
            } catch (error: any) {
                expect(error.message).toEqual(
                    `${err.message}: Attempted to assign user's manager, but no user was found with userPrincipalName "user"`,
                )
            }
        })

        it('throws an error given manager is not found', async () => {
            const err = new Error('resource not found')
            jest.spyOn(mockAxios, 'get')
                .mockResolvedValueOnce({ data: { id: 'userId' } })
                .mockRejectedValueOnce(err)
            try {
                await users.assignManager('user', 'manager')
                expect(true).toBe(false)
            } catch (error: any) {
                expect(error.message).toEqual(
                    `${err.message}: Attempted to assign manager as user's manager, but no user was found with userPrincipalName "manager"`,
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

    describe('removeManager', () => {
        it('throws an error given user is not found', async () => {
            const err = new Error('resource not found')
            jest.spyOn(mockAxios, 'get').mockRejectedValue(err)
            try {
                await users.removeManager('user')
                expect(true).toBe(false)
            } catch (error: any) {
                expect(error.message).toEqual(
                    `${err.message}: Attempted to remove user's manager, but no user was found with userPrincipalName "user"`,
                )
            }
        })

        it('removes a manager', async () => {
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { id: 'userId' } })
            jest.spyOn(mockAxios, 'delete').mockResolvedValue({ status: 204 })
            await users.removeManager('user')
            expect(mockAxios.delete).toHaveBeenCalledWith('users/userId/manager/$ref')
        })
    })
})
