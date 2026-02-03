import { MicrosoftApiBase } from '../microsoft-api-base'
import { GraphApiConfig } from '../types'
import { Domains } from './domains/domains'
import { Gdap } from './gdap/gdap'
import { Licenses } from './licenses/licenses'
import { Users } from './users/users'
import { Applications } from './applications/applications'

export class MicrosoftGraphApi extends MicrosoftApiBase {
    applications!: Applications

    domains!: Domains

    gdap!: Gdap

    users!: Users

    licenses!: Licenses

    constructor(config: GraphApiConfig) {
        super(config, 'https://graph.microsoft.com/v1.0/', 'https://graph.microsoft.com/.default')
        this.applications = new Applications(this.httpAgent)
        this.domains = new Domains(this.httpAgent)
        this.gdap = new Gdap(this.httpAgent)
        this.users = new Users(this.httpAgent)
        this.licenses = new Licenses(this.httpAgent)
    }
}
