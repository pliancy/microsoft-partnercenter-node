import { Users } from './users'
import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'
import { GraphUserDefaultProperties } from './user.types'

describe('Users', () => {
    let users: Users

    beforeEach(() => (users = new Users(mockAxios as unknown as AxiosInstance)))

    afterEach(() => mockAxios.reset())

    it('creates an instance of Users', () => expect(users).toBeTruthy())

    describe('get', () => {
        it('gets a user by id or userPrincipalName (default)', async () => {
            const data = { id: 'id', userPrincipalName: 'userPrincipalName' }
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data })
            await expect(users.get('id')).resolves.toEqual(data)
            expect(mockAxios.get).toHaveBeenCalledWith(
                `users/id?$select=${GraphUserDefaultProperties.join(',')}`,
            )
        })

        it('gets a user by id or userPrincipalName (additional)', async () => {
            const data = {
                id: 'id',
                userPrincipalName: 'userPrincipalName',
                showInAddressList: true,
            }
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data })
            await expect(users.get('id', ['showInAddressList'])).resolves.toEqual(data)
            expect(mockAxios.get).toHaveBeenCalledWith(
                `users/id?$select=${GraphUserDefaultProperties.join(',')},showInAddressList`,
            )
        })

        it('gets a user by id or userPrincipalName (expand)', async () => {
            const data = {
                id: 'id',
                userPrincipalName: 'userPrincipalName',
                showInAddressList: true,
                manager: {
                    id: 'managerId',
                    userPrincipalName: 'managerUPN',
                },
            }
            jest.spyOn(mockAxios, 'get').mockResolvedValue({ data })
            await expect(
                users.get('id', ['showInAddressList'], ['manager($select=userPrincipalName)']),
            ).resolves.toEqual(data)
            expect(mockAxios.get).toHaveBeenCalledWith(
                `users/id?$select=${GraphUserDefaultProperties.join(',')},showInAddressList&$expand=manager($select=userPrincipalName)`,
            )
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

    describe('create', () => {
        it('creates a user', async () => {
            const data = { displayName: 'John Doe' } as any
            const createdUser = { id: 'userId', ...data }
            jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: createdUser })

            const result = await users.create(data)

            expect(result).toEqual(createdUser)
            expect(mockAxios.post).toHaveBeenCalledWith('users', { displayName: 'John Doe' })
        })
    })

    describe('update', () => {
        it('updates a user', async () => {
            const data = { displayName: 'John Doe Updated' } as any
            const updatedUser = { id: 'userId', ...data }
            jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: updatedUser })

            const result = await users.update('userId', data)

            expect(result).toEqual(updatedUser)
            expect(mockAxios.patch).toHaveBeenCalledWith('users/userId', data)
            expect(mockAxios.get).not.toHaveBeenCalled()
        })
    })
})
