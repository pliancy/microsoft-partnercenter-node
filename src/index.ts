import got from 'got'
import qs from 'querystring'

/**
 * The Config for the PartnerCenter class
 *
 * @export
 * @interface IPartnerCenterConfig
 */
interface IPartnerCenterConfig {
  /** the client_id from partnercenter */
  tenantId: string
  authentication: ClientAuth | BearerAuth
}
interface ClientAuth {
  clientId: string
  clientSecret: string
  refreshToken?: string
}

interface BearerAuth {
  bearerToken: string
}

interface IOAuthResponse {
  token_type: string
  expires_in: string
  ext_expires_in: string
  expires_on: string
  not_before: string
  resource: string
  access_token: string
}

class PartnerCenter {
  config: IPartnerCenterConfig
  accessToken: string
  reqHeaders: any

  constructor (_config: IPartnerCenterConfig) {
    this.config = _config
    this.accessToken = ''
    this.reqHeaders = {
      authorization: `Bearer ${this.accessToken}`,
      'content-type': 'application/json',
      accept: 'application/json'
    }
  }

  /* eslint-disable no-useless-catch */
  async getAllCustomers (): Promise<object[]> {
    try {
      const res = await this._partnerCenterRequest(
        'https://api.partnercenter.microsoft.com/v1/customers',
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body.slice(1)).items
    } catch (err) {
      throw err
    }
  }

  async getInvoices (): Promise<object[]> {
    try {
      const res = await this._partnerCenterRequest(
        'https://api.partnercenter.microsoft.com/v1/invoices',
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  async getInvoicePDF (invoiceID: string): Promise<Buffer> {
    try {
      const res = await this._partnerCenterRequest(
        `https://api.partnercenter.microsoft.com/v1/invoices/${invoiceID}/documents/statement`,
        { headers: this.reqHeaders, encoding: null }
      )
      return res.body
    } catch (err) {
      throw err
    }
  }

  async getCustomerById (customerId: string): Promise<object> {
    try {
      const res = await this._partnerCenterRequest(
        `https://api.partnercenter.microsoft.com/v1/customers/${customerId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async getCustomerSubscriptions (customerId: string): Promise<object[]> {
    try {
      const res = await this._partnerCenterRequest(
        `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body.slice(1)).items
    } catch (err) {
      throw err
    }
  }

  async getCustomerSubscriptionById (
    customerId: string,
    subscriptionId: string
  ): Promise<object> {
    try {
      const res = await this._partnerCenterRequest(
        `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async getCustomerSubscriptionByOfferId (
    customerId: string,
    offerId: string
  ): Promise<object> {
    try {
      const allSubs = await this._partnerCenterRequest(
        `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions`,
        { headers: this.reqHeaders }
      )
      const sub = JSON.parse(allSubs.body.slice(1)).items.find(
        (e: any) => e.offerId === offerId
      )
      return sub
    } catch (err) {
      throw err
    }
  }

  async updateCustomerSubscriptionUsers (
    customerId: string,
    subscriptionId: string,
    usersQuantity: number
  ): Promise<object> {
    try {
      const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`
      const res = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders
      })
      const subscription = JSON.parse(res.body.slice(1))
      subscription.Quantity = usersQuantity
      const updateResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'patch',
        body: JSON.stringify(subscription)
      })
      return JSON.parse(updateResponse.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async updateCustomerSubscription (
    customerId: string,
    subscriptionId: string,
    subscriptionObject: object
  ): Promise<object> {
    try {
      const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`
      const updateResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'patch',
        body: JSON.stringify(subscriptionObject)
      })
      return JSON.parse(updateResponse.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async createSubscription (
    customerId: string,
    offerId: string,
    usersQuantity: number,
    billingCycle: 'monthly' | 'annual'
  ): Promise<object> {
    try {
      const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/orders`
      const createResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'post',
        body: JSON.stringify({
          lineItems: [
            {
              offerId: offerId,
              quantity: usersQuantity,
              lineItemNumber: 0
            }
          ],
          billingCycle: billingCycle
        })
      })
      return JSON.parse(createResponse.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async uploadDeviceBatch (
    customerId: string,
    batchId: string,
    devices: [object],
    existingBatch?: boolean
  ): Promise<object> {
    try {
      let url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/deviceBatches`
      let body: any = {}
      if (typeof existingBatch !== 'undefined') {
        url += `${batchId}/devices`
        body = devices
      } else {
        body = {
          Attributes: {
            ObjectType: 'DeviceBatchCreationRequest'
          },
          BatchId: batchId,
          Devices: devices
        }
      }
      const createResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'post',
        body: JSON.stringify(body)
      })
      return {
        batchTrackingId: createResponse.headers.location.split('/').pop()
      }
    } catch (err) {
      throw err
    }
  }

  async getDeviceBatches (customerId: string): Promise<object> {
    try {
      const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/deviceBatches`
      const createResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'get'
      })
      return JSON.parse(createResponse.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async getDeviceBatch (customerId: string, batchId: string): Promise<object> {
    try {
      const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/deviceBatches/${batchId}/devices`

      const createResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'get'
      })
      return JSON.parse(createResponse.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async getDeviceBatchStatus (
    customerId: string,
    batchTrackingId: string
  ): Promise<object> {
    try {
      const url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/batchjobstatus/${batchTrackingId}`
      const createResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'get'
      })
      return JSON.parse(createResponse.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  isClientAuth = (e: ClientAuth | BearerAuth): e is ClientAuth => {
    return (e as Partial<ClientAuth>).clientId !== undefined
  }

  isBearerAuth = (e: ClientAuth | BearerAuth): e is BearerAuth => {
    return (e as Partial<BearerAuth>).bearerToken !== undefined
  }

  private async _authenticate (): Promise<string | undefined> {
    if (this.isClientAuth(this.config.authentication)) {
      const body: any = {
        client_id: this.config.authentication.clientId,
        client_secret: this.config.authentication.clientSecret
      }

      if (typeof this.config.authentication.refreshToken !== 'undefined') {
        body.grant_type = 'refresh_token'
        body.refresh_token = this.config.authentication.refreshToken
      } else {
        body.resource = 'https://graph.windows.net'
        body.grant_type = 'client_credentials'
      }

      const res = await got(
        `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify(body)
        }
      )

      const resBody: IOAuthResponse = JSON.parse(res.body)
      this.accessToken = resBody.access_token

      return resBody.access_token
    }
  }

  private async _partnerCenterRequest (
    url: string,
    options: any
  ): Promise<any> {
    if (this.isClientAuth(this.config.authentication)) {
      try {
        if (this.accessToken === '') {
          const token = await this._authenticate()
          if (typeof token === 'string') {
            options.headers.Authorization = `Bearer ${token}`
          }
        } else {
          options.headers.Authorization = `Bearer ${this.accessToken}`
        }
        const res = await got(url, options)
        return res
      } catch (err) {
        if (err.statusCode === 401) {
          const token = await this._authenticate()
          if (typeof token === 'string') {
            options.headers.Authorization = `Bearer ${token}`
          }
          const res = await got(url, options)
          return res
        }
        throw err
      }
    } else if (this.isBearerAuth(this.config.authentication)) {
      try {
        if (this.accessToken === '') {
          this.accessToken = this.config.authentication.bearerToken
          options.headers.Authorization = `Bearer ${this.accessToken}`
        }
        const res = await got(url, options)
        return res
      } catch (err) {
        if (err.statusCode === 401) {
          options.headers.Authorization = `Bearer ${this.config.authentication.bearerToken}`
          const res = await got(url, options)
          return res
        }
        throw err
      }
    }
  }
}

export = PartnerCenter
