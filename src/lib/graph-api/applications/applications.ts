import { AxiosInstance } from 'axios'
import { AppRole, AppServicePrincipal, GraphApplication } from './application.types'

export class Applications {
    constructor(private readonly http: AxiosInstance) {}

    async getById(appId: string): Promise<GraphApplication> {
        const { data: app } = await this.http.get(`applications(appId='${appId}')`)
        return app
    }

    async getAppPermissions(appId: string): Promise<AppRole[]> {
        const app = await this.getById(appId)

        // 2) For each resourceAppId, fetch the Service Principal
        const resourceAppIds = [...new Set(app.requiredResourceAccess.map((r) => r.resourceAppId))]

        const servicePrincipals = {} as { [index: string]: AppServicePrincipal }
        await Promise.all(
            resourceAppIds.map(async (resourceAppId) => {
                const { data: spRes } = (await this.http.get(
                    `servicePrincipals?$filter=appId eq '${resourceAppId}'&$select=id,displayName,appRoles,oauth2PermissionScopes`,
                )) as any

                if (!spRes.value || spRes.value.length === 0) {
                    throw new Error(
                        `Service Principal not found for resourceAppId: ${resourceAppId}`,
                    )
                }

                servicePrincipals[resourceAppId] = spRes.value[0]
            }),
        )

        // 3) Join IDs → names
        return app.requiredResourceAccess.map((resource) => {
            const sp = servicePrincipals[resource.resourceAppId]

            return {
                role: sp?.displayName ?? resource.resourceAppId,
                permissions: resource.resourceAccess.map((p: any) => {
                    let def

                    if (p.type === 'Role') {
                        def = sp?.appRoles?.find((r: any) => r.id === p.id)
                    } else {
                        def = sp?.oauth2PermissionScopes?.find((s: any) => s.id === p.id)
                    }

                    return {
                        name: def?.value ?? p.id,
                        type: p.type === 'Role' ? 'Application' : 'Delegated',
                    }
                }),
            }
        })
    }
}
