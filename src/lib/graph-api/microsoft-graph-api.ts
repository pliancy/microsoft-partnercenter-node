import { MicrosoftApiBase } from '../microsoft-api-base'
import { GraphApiConfig } from '../types'
import { Domains } from './domains/domains'
import { Gdap } from './gdap/gdap'
import { Licenses } from './licenses/licenses'
import { Users } from './users/users'
import { EnterpriseApplications } from './enterprise-applications/enterprise-applications'

export class MicrosoftGraphApi extends MicrosoftApiBase {
    domains!: Domains

    enterpriseApplications!: EnterpriseApplications

    gdap!: Gdap

    users!: Users

    licenses!: Licenses

    constructor(config: GraphApiConfig) {
        super(config, 'https://graph.microsoft.com/v1.0/', 'https://graph.microsoft.com/.default')
        this.domains = new Domains(this.httpAgent)
        this.enterpriseApplications = new EnterpriseApplications(this.httpAgent)
        this.gdap = new Gdap(this.httpAgent)
        this.users = new Users(this.httpAgent)
        this.licenses = new Licenses(this.httpAgent)
    }
}
