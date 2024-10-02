import { MicrosoftApiBase } from '../microsoft-api-base'
import { GraphApiConfig } from '../types'
import { Domains } from './domains/domains'
import { Gdap } from './gdap/gdap'
import { Users } from './users/users'

export class MicrosoftGraphApi extends MicrosoftApiBase {
    domains!: Domains

    gdap!: Gdap

    users!: Users

    constructor(config: GraphApiConfig) {
        super(config, 'https://graph.microsoft.com/v1.0/', 'https://graph.microsoft.com/.default')
        this.domains = new Domains(this.httpAgent)
        this.gdap = new Gdap(this.httpAgent)
        this.users = new Users(this.httpAgent)
    }
}
