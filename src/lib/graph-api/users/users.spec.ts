import { Users } from './users'
import axios, { AxiosInstance } from 'axios'
import { GraphUserDefaultProperties } from './user.types'

describe('Users', () => {
    let users: Users

    beforeEach(() => (users = new Users(axios as unknown as AxiosInstance)))

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('creates an instance of Users', () => expect(users).toBeTruthy())

    describe('get', () => {
        it('gets a user by id or userPrincipalName (default)', async () => {
            const data = { id: 'id', userPrincipalName: 'userPrincipalName' }
            jest.spyOn(axios, 'get').mockResolvedValue({ data })
            await expect(users.get('id')).resolves.toEqual(data)
            expect(axios.get).toHaveBeenCalledWith(
                `users/id?$select=${GraphUserDefaultProperties.join(',')}`,
            )
        })

        it('gets a user by id or userPrincipalName (additional)', async () => {
            const data = {
                id: 'id',
                userPrincipalName: 'userPrincipalName',
                showInAddressList: true,
            }
            jest.spyOn(axios, 'get').mockResolvedValue({ data })
            await expect(users.get('id', ['showInAddressList'])).resolves.toEqual(data)
            expect(axios.get).toHaveBeenCalledWith(
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
            jest.spyOn(axios, 'get').mockResolvedValue({ data })
            await expect(
                users.get('id', ['showInAddressList'], ['manager($select=userPrincipalName)']),
            ).resolves.toEqual(data)
            expect(axios.get).toHaveBeenCalledWith(
                `users/id?$select=${GraphUserDefaultProperties.join(',')},showInAddressList&$expand=manager($select=userPrincipalName)`,
            )
        })
    })

    describe('getManager', () => {
        it(`gets a user's manager by user's userPrincipalName`, async () => {
            const user = { id: 'id', userPrincipalName: 'userPrincipalName' }
            const manager = { id: 'id', userPrincipalName: 'managerPrincipalName' }
            jest.spyOn(axios, 'get').mockResolvedValue({ data: manager })
            await expect(users.getManager(user.userPrincipalName)).resolves.toEqual(manager)
            expect(axios.get).toHaveBeenCalledWith(`users/${user.userPrincipalName}/manager`)
        })
    })

    describe('assignManager', () => {
        it('throws an error given user is not found', async () => {
            const err = new Error('resource not found')
            jest.spyOn(axios, 'get').mockRejectedValue(err)
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
            jest.spyOn(axios, 'get')
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
            jest.spyOn(axios, 'get')
                .mockResolvedValueOnce({ data: { id: 'userId' } })
                .mockResolvedValueOnce({ data: { id: 'managerId' } })
            jest.spyOn(axios, 'put').mockResolvedValue({ status: 204 })
            await users.assignManager('user', 'manager')
            expect(axios.put).toHaveBeenCalledWith('users/userId/manager/$ref', {
                '@odata.id': 'https://graph.microsoft.com/v1.0/users/managerId',
            })
        })
    })

    describe('removeManager', () => {
        it('throws an error given user is not found', async () => {
            const err = new Error('resource not found')
            jest.spyOn(axios, 'get').mockRejectedValue(err)
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
            jest.spyOn(axios, 'get').mockResolvedValue({ data: { id: 'userId' } })
            jest.spyOn(axios, 'delete').mockResolvedValue({ status: 204 })
            await users.removeManager('user')
            expect(axios.delete).toHaveBeenCalledWith('users/userId/manager/$ref')
        })
    })

    describe('create', () => {
        it('creates a user', async () => {
            const data = { displayName: 'John Doe' } as any
            const createdUser = { id: 'userId', ...data }
            jest.spyOn(axios, 'post').mockResolvedValue({ data: createdUser })

            const result = await users.create(data)

            expect(result).toEqual(createdUser)
            expect(axios.post).toHaveBeenCalledWith('users', { displayName: 'John Doe' })
        })
    })

    describe('update', () => {
        it('updates a user', async () => {
            const data = { displayName: 'John Doe Updated' } as any
            const updatedUser = { id: 'userId', ...data }
            jest.spyOn(axios, 'patch').mockResolvedValue(null)
            jest.spyOn(axios, 'get').mockResolvedValue({ data: updatedUser })

            const result = await users.update('userId', data)

            expect(result).toEqual(updatedUser)
            expect(axios.patch).toHaveBeenCalledWith('users/userId', data)
            expect(axios.get).toHaveBeenCalledWith(
                `users/userId?$select=${GraphUserDefaultProperties.join(',')}`,
            )
        })
    })
})
