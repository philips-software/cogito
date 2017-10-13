require('isomorphic-fetch') /* global fetch, Request */

class QueuingService {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  async send (queueId, message) {
    const url = `${this.baseUrl}/${queueId}`
    const options = { method: 'POST', body: message }
    const response = await fetch(new Request(url, options))
    if (!response.ok) {
      throw new Error(`sending failed (${response.status})`)
    }
  }
}

module.exports = QueuingService
