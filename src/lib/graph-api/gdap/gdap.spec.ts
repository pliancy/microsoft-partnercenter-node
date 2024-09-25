import mockAxios from 'jest-mock-axios'
import {
    CreateGDAPAccessAssignment,
    CreateGDAPRelationship,
    GDAPAccessAssignment,
    GDAPRelationship,
    UpdateGDAPAccessAssignment,
} from '../../types'
import { Gdap } from './gdap'
import { AxiosInstance } from 'axios'

describe('Gdap', () => {
    let gdap: Gdap

    beforeEach(() => {
        gdap = new Gdap(mockAxios as never as AxiosInstance)
    })

    afterEach(() => {
        mockAxios.reset()
    })

    it('should create a GDAP relationship', async () => {
        const relationship: GDAPRelationship = { id: '1' } as GDAPRelationship
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: relationship })
        const data: CreateGDAPRelationship = {
            customer: { tenantId: 'customerId' },
        } as CreateGDAPRelationship
        const result = await gdap.createGDAPRelationship(data)
        expect(result).toEqual(relationship)
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships',
            data,
        )
    })

    it('should get all GDAP relationships', async () => {
        const relationships: GDAPRelationship[] = [{ id: '1' }, { id: '2' }] as GDAPRelationship[]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { value: relationships } })
        const result = await gdap.getAllGDAPRelationships()
        expect(result).toEqual(relationships)
        expect(mockAxios.get).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships',
        )
    })

    it('should get a GDAP relationship', async () => {
        const relationship: GDAPRelationship = { id: '1' } as GDAPRelationship
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: relationship })
        const result = await gdap.getGDAPRelationship('1')
        expect(result).toEqual(relationship)
        expect(mockAxios.get).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships/1',
        )
    })

    it('should get GDAP relationships by customer ID', async () => {
        const relationships: GDAPRelationship[] = [{ id: '1' }, { id: '2' }] as GDAPRelationship[]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { value: relationships } })
        const result = await gdap.getGDAPRelationshipsByCustomerId('customerId')
        expect(result).toEqual(relationships)
        expect(mockAxios.get).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships',
            {
                params: {
                    $filter: encodeURIComponent("customer/tenantId eq 'customerId'"),
                },
                paramsSerializer: expect.any(Function),
            },
        )
    })

    it('should update a GDAP relationship', async () => {
        const updatedRelationship: GDAPRelationship = {
            id: '1',
            displayName: 'Updated',
        } as GDAPRelationship
        jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: updatedRelationship })
        const result = await gdap.updateGDAPRelationship('1', {
            displayName: 'Updated',
        })
        expect(result).toEqual(updatedRelationship)
        expect(mockAxios.patch).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships/1',
            { displayName: 'Updated' },
        )
    })

    it('should delete a GDAP relationship', async () => {
        jest.spyOn(mockAxios, 'delete').mockResolvedValue({})
        await gdap.deleteGDAPRelationship('1')
        expect(mockAxios.delete).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships/1',
        )
    })

    it('should create a GDAP access assignment', async () => {
        const assignment: GDAPAccessAssignment = { id: '1' } as GDAPAccessAssignment
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: assignment })
        const data: CreateGDAPAccessAssignment = {
            accessContainer: { id: 'containerId' },
        } as never as CreateGDAPAccessAssignment
        const result = await gdap.createGDAPAccessAssignment('relationshipId', data)
        expect(result).toEqual(assignment)
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships/relationshipId/accessAssignments',
            data,
        )
    })

    it('should get all GDAP access assignments', async () => {
        const assignments: GDAPAccessAssignment[] = [
            { id: '1' },
            { id: '2' },
        ] as GDAPAccessAssignment[]
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: { value: assignments } })
        const result = await gdap.getAllGDAPAccessAssignments('relationshipId')
        expect(result).toEqual(assignments)
        expect(mockAxios.get).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships/relationshipId/accessAssignments',
        )
    })

    it('should get a GDAP access assignment', async () => {
        const assignment: GDAPAccessAssignment = { id: '1' } as GDAPAccessAssignment
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data: assignment })
        const result = await gdap.getGDAPAccessAssignment('relationshipId', '1')
        expect(result).toEqual(assignment)
        expect(mockAxios.get).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships/relationshipId/accessAssignments/1',
        )
    })

    it('should update a GDAP access assignment', async () => {
        const updatedAssignment: GDAPAccessAssignment = {
            id: '1',
            accessDetails: { unifiedRoles: ['role1'] },
        } as never as GDAPAccessAssignment
        jest.spyOn(mockAxios, 'patch').mockResolvedValue({ data: updatedAssignment })
        const data: UpdateGDAPAccessAssignment = {
            accessDetails: { unifiedRoles: ['role1'] },
        } as never as UpdateGDAPAccessAssignment
        const result = await gdap.updateGDAPAccessAssignment('relationshipId', '1', data)
        expect(result).toEqual(updatedAssignment)
        expect(mockAxios.patch).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships/relationshipId/accessAssignments/1',
            data,
        )
    })

    it('should delete a GDAP access assignment', async () => {
        jest.spyOn(mockAxios, 'delete').mockResolvedValue({})
        await gdap.deleteGDAPAccessAssignment('relationshipId', '1')
        expect(mockAxios.delete).toHaveBeenCalledWith(
            '/tenantRelationships/delegatedAdminRelationships/relationshipId/accessAssignments/1',
        )
    })
})
