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

    describe('create', () => {
        it('creates a user without a manager', async () => {
            const data = { displayName: 'John Doe' } as any
            const createdUser = { id: 'userId', ...data }
            jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: createdUser })

            const result = await users.create(data)

            expect(result).toEqual(createdUser)
            expect(mockAxios.post).toHaveBeenCalledWith('/users', { displayName: 'John Doe' })
        })

        it('creates a user with a manager', async () => {
            const data = { displayName: 'John Doe', manager: 'managerId' } as any
            const createdUser = { id: 'userId', displayName: 'John Doe' }
            const manager = { id: 'managerId', userPrincipalName: 'managerUPN' }

            jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: createdUser })
            jest.spyOn(mockAxios, 'get')
                .mockResolvedValueOnce({ data: manager }) // create -> get(managerId)
                .mockResolvedValueOnce({ data: createdUser }) // assignManager -> get(userId)
                .mockResolvedValueOnce({ data: manager }) // assignManager -> get(managerId)
            jest.spyOn(mockAxios, 'put').mockResolvedValue({ status: 204 })

            const result = await users.create(data)

            expect(result).toEqual(createdUser)
            expect(mockAxios.post).toHaveBeenCalledWith('/users', { displayName: 'John Doe' })
            expect(mockAxios.put).toHaveBeenCalledWith('users/userId/manager/$ref', {
                '@odata.id': 'https://graph.microsoft.com/v1.0/users/managerId',
            })
        })

        it('creates a user even if manager check is redundant', async () => {
            const data = { displayName: 'John Doe', manager: 'managerId' } as any
            const createdUser = { id: 'userId', displayName: 'John Doe' }
            const manager = { id: 'managerId', userPrincipalName: 'managerUPN' }

            jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: createdUser })
            jest.spyOn(mockAxios, 'get')
                .mockResolvedValueOnce({ data: manager }) // create -> get(managerId)
                .mockResolvedValueOnce({ data: createdUser }) // assignManager -> get(userId)
                .mockResolvedValueOnce({ data: manager }) // assignManager -> get(managerId)
            jest.spyOn(mockAxios, 'put').mockResolvedValue({ status: 204 })

            const result = await users.create(data)

            expect(result).toEqual(createdUser)
            expect(mockAxios.put).toHaveBeenCalled()
        })
    })

    describe('update', () => {
        it('updates a user without touching the manager', async () => {
            const data = { displayName: 'John Doe Updated' } as any
            const updatedUser = { id: 'userId', ...data }
            jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: updatedUser })

            const result = await users.update('userId', data)

            expect(result).toEqual(updatedUser)
            expect(mockAxios.patch).toHaveBeenCalledWith('/users/userId', data)
            expect(mockAxios.get).not.toHaveBeenCalled()
        })

        it('updates a user and assigns a new manager', async () => {
            const data = { manager: 'newManagerId' } as any
            const updatedUser = { id: 'userId' }
            const newManager = { id: 'newManagerId', userPrincipalName: 'newManagerUPN' }

            jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: updatedUser })
            jest.spyOn(mockAxios, 'get')
                .mockRejectedValueOnce(new Error('Not Found')) // getManager(userId)
                .mockResolvedValueOnce({ data: updatedUser }) // assignManager -> get(userId)
                .mockResolvedValueOnce({ data: newManager }) // assignManager -> get(newManagerId)
            jest.spyOn(mockAxios, 'put').mockResolvedValue({ status: 204 })

            const result = await users.update('userId', data)

            expect(result).toEqual(updatedUser)
            expect(mockAxios.put).toHaveBeenCalledWith('users/userId/manager/$ref', {
                '@odata.id': 'https://graph.microsoft.com/v1.0/users/newManagerId',
            })
            expect(mockAxios.patch).toHaveBeenCalledWith('/users/userId', {})
        })

        it('updates a user but skips assigning manager if it is the same', async () => {
            const data = { manager: 'managerId' } as any
            const updatedUser = { id: 'userId' }
            const manager = { id: 'managerId', userPrincipalName: 'managerId' }

            jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: updatedUser })
            jest.spyOn(mockAxios, 'get').mockResolvedValueOnce({ data: manager }) // getManager(userId)

            const result = await users.update('userId', data)

            expect(result).toEqual(updatedUser)
            expect(mockAxios.put).not.toHaveBeenCalled()
            expect(mockAxios.patch).toHaveBeenCalledWith('/users/userId', {})
        })

        it('removes a manager if set to null', async () => {
            const data = { manager: null } as any
            const updatedUser = { id: 'userId' }
            const manager = { id: 'managerId' }

            jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: updatedUser })
            jest.spyOn(mockAxios, 'get')
                .mockResolvedValueOnce({ data: manager }) // getManager(userId)
                .mockResolvedValueOnce({ data: updatedUser }) // removeManager -> get(userId)
            jest.spyOn(mockAxios, 'delete').mockResolvedValue({ status: 204 })

            const result = await users.update('userId', data)

            expect(result).toEqual(updatedUser)
            expect(mockAxios.delete).toHaveBeenCalledWith('users/userId/manager/$ref')
        })

        it('skips removing manager if set to null but no manager exists', async () => {
            const data = { manager: null } as any
            const updatedUser = { id: 'userId' }

            jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: updatedUser })
            jest.spyOn(mockAxios, 'get').mockRejectedValueOnce(new Error('Not Found')) // getManager(userId)

            const result = await users.update('userId', data)

            expect(result).toEqual(updatedUser)
            expect(mockAxios.delete).not.toHaveBeenCalled()
        })
    })
})
