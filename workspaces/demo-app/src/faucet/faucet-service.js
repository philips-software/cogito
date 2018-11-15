import base64url from 'base64url'
import fetch from 'cross-fetch'

const Request = fetch.Request

class FaucetService {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  async transferFunds (account) {
    console.log('transfering funds to ' + account)
    const url = `${this.baseUrl}/${account}`
    const body = base64url.encode(Buffer.from(''))
    const response = await fetch(new Request(url, { method: 'POST', body }))
    if (!response.ok) {
      throw new Error(`transfering funds failed (${response.status})`)
    }
  }
}

export { FaucetService }
