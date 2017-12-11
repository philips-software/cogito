const fetch = require('cross-fetch')
const { Request, Headers } = fetch

class QueuingService {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  async send (queueId, message) {
    const url = `${this.baseUrl}/${queueId}`
    const headers = new Headers({ 'Content-Type': 'application/octet-stream' })
    const options = { method: 'POST', body: message, headers }
    const response = await fetch(new Request(url, options))
    if (!response.ok) {
      throw new Error(`sending failed (${response.status})`)
    }
  }

  async receive (queueId) {
    const response = await fetch(`${this.baseUrl}/${queueId}`)
    if (!response.ok) {
      throw new Error(`receiving failed (${response.status})`)
    }
    if (response.status === 204) {
      return null
    }
    return response.text()
  }
}

module.exports = QueuingService
