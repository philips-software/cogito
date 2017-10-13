require('isomorphic-fetch') /* global fetch, Request */

class QueuingService {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  async send (queueId, message) {
    const url = `${this.baseUrl}/${queueId}`
    await fetch(new Request(url, { method: 'POST', body: message }))
  }
}

module.exports = QueuingService
