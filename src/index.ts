import got from 'got'
import qs from 'querystring'

export interface IPartnerCenterConfig {
  clientId: string,
  clientSecret: string
}

export interface IOAuthResponse {
  token_type: string,
  expires_in: string,
  ext_expires_in: string,
  expires_on: string,
  not_before: string,
  resource: string,
  access_token: string
}

export class PartnerCenter {
  config: IPartnerCenterConfig
  accessToken: string
  reqHeaders: any
  constructor (_config: IPartnerCenterConfig) {
    this.config = _config
    this.accessToken = ''
    this.reqHeaders = {
      'authorization': `Bearer ${this.accessToken}`,
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  }
  async _authenticate (): Promise<string> {
    let res = await got('https://login.windows.net/pliancy.onmicrosoft.com/oauth2/token', {
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
    })
    let body: IOAuthResponse = JSON.parse(res.body)
    this.accessToken = body.access_token
    return body.access_token
  }

  async getAllCustomers (): Promise<object[]> {
    try {
      if (!this.accessToken) await this._authenticate()
      let res = await got('https://api.partnercenter.microsoft.com/v1/customers', { headers: this.reqHeaders })
      return JSON.parse(res.body.slice(1)).items
    } catch (err) {
      if (err.statusCode === 401) {
        try {
          this.accessToken = await this._authenticate()
          let tryAgain = await this.getAllCustomers()
          return tryAgain
        } catch (err) {
          throw err
        }
      }
      throw err
    }
  }

  async getCustomerById (customerId: string): Promise<object> {
    try {
      if (!this.accessToken) await this._authenticate()
      let res = await got(`https://api.partnercenter.microsoft.com/v1/customers/${customerId}`, { headers: this.reqHeaders })
      return JSON.parse(res.body.slice(1))
    } catch (err) {
      if (err.statusCode === 401) {
        try {
          this.accessToken = await this._authenticate()
          let tryAgain = await this.getCustomerById(customerId)
          return tryAgain
        } catch (err) {
          throw err
        }
      }
      throw err
    }
  }
  async getCustomerSubscriptions (customerId: string): Promise<object[]> {
    try {
      if (!this.accessToken) await this._authenticate()
      let res = await got(`https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions`, { headers: this.reqHeaders })
      return JSON.parse(res.body.slice(1)).items
    } catch (err) {
      if (err.statusCode === 401) {
        try {
          this.accessToken = await this._authenticate()
          let tryAgain = await this.getCustomerSubscriptions(customerId)
          return tryAgain
        } catch (err) {
          throw err
        }
      }
      throw err
    }
  }
  async getCustomerSubscriptionById (customerId: string, subscriptionId: string): Promise<object> {
    try {
      if (!this.accessToken) await this._authenticate()
      let res = await got(`https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`, { headers: this.reqHeaders })
      return JSON.parse(res.body.slice(1))
    } catch (err) {
      if (err.statusCode === 401) {
        try {
          this.accessToken = await this._authenticate()
          let tryAgain = await this.getCustomerSubscriptionById(customerId, subscriptionId)
          return tryAgain
        } catch (err) {
          throw err
        }
      }
      throw err
    }
  }
  async updateCustomerSubscriptionUsers (customerId: string, subscriptionId: string, usersQuantity: number): Promise<object> {
    try {
      let url = `https://api.partnercenter.microsoft.com/v1/customers/${customerId}/subscriptions/${subscriptionId}`
      if (!this.accessToken) await this._authenticate()
      let res = await got(url, { headers: this.reqHeaders })
      let subscription = JSON.parse(res.body.slice(1))
      subscription.Quantity = usersQuantity
      let updateResponse = await got(url, {
        headers: this.reqHeaders,
        method: 'patch',
        body: JSON.stringify(subscription)
      })
      return JSON.parse(updateResponse.body.slice(1))
    } catch (err) {
      if (err.statusCode === 401) {
        try {
          this.accessToken = await this._authenticate()
          let tryAgain = await this.updateCustomerSubscriptionUsers(customerId, subscriptionId, usersQuantity)
          return tryAgain
        } catch (err) {
          throw err
        }
      }
      throw err
    }
  }
}
