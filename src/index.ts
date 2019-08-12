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
  clientId: string
  clientSecret: string
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

  async getAllCustomers (): Promise<object[]> {
    try {
      let res = await this._partnerCenterRequest(
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
      let res = await this._partnerCenterRequest(
        'https://api.partnercenter.microsoft.com/v1/invoices',
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body)
    } catch (err) {
      throw err
    }
  }

  // Returns an invoice pdf as a buffer stream
  async getInvoicePDF (invoiceID: string) {
    try {
      let res = await this._partnerCenterRequest(
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
      let res = await this._partnerCenterRequest(
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
      let res = await this._partnerCenterRequest(
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
      let res = await this._partnerCenterRequest(
        `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`,
        { headers: this.reqHeaders }
      )
      return JSON.parse(res.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async getCustomerSubscriptionByOfferId (customerId: string, offerId: string): Promise<object> {
    try {
      let allSubs = await this._partnerCenterRequest(`https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions`, { headers: this.reqHeaders })
      let sub = JSON.parse(allSubs.body.slice(1)).items.find((e: any) => e.offerId === offerId)
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
      let url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`
      let res = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders
      })
      let subscription = JSON.parse(res.body.slice(1))
      subscription.Quantity = usersQuantity
      let updateResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'patch',
        body: JSON.stringify(subscription)
      })
      return JSON.parse(updateResponse.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async updateCustomerSubscription (customerId: string, subscriptionId: string, subscriptionObject: object): Promise<object> {
    try {
      let url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`
      let updateResponse = await this._partnerCenterRequest(url, {
        headers: this.reqHeaders,
        method: 'patch',
        body: JSON.stringify(subscriptionObject)
      })
      return JSON.parse(updateResponse.body.slice(1))
    } catch (err) {
      throw err
    }
  }

  async createSubscription (customerId: string, offerId: string, usersQuantity: number, billingCycle: 'monthly' | 'annual'): Promise<object> {
    try {
      let url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/orders`
      let createResponse = await this._partnerCenterRequest(url, {
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

  private async _authenticate (): Promise<string> {
    let res = await got(
      'https://login.windows.net/pliancy.onmicrosoft.com/oauth2/token',
      {
        method: 'post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
          grant_type: 'client_credentials',
          resource: 'https://graph.windows.net',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret
        })
      }
    )
    let body: IOAuthResponse = JSON.parse(res.body)
    this.accessToken = body.access_token
    return body.access_token
  }

  private async _partnerCenterRequest (url: string, options: any): Promise<any> {
    try {
      if (!this.accessToken) {
        let token = await this._authenticate()
        options.headers.authorization = `Bearer ${token}`
      }
      let res = await got(url, options)
      return res
    } catch (err) {
      try {
        if (err.statusCode === 401) {
          let token = await this._authenticate()
          options.headers.authorization = `Bearer ${token}`
          let res = await got(url, options)
          return res
        }
        throw err
      } catch (err) {
        throw err
      }
    }
  }
}

export = PartnerCenter
