import base64url from 'base64url'
import fetch from 'cross-fetch'

const Request = fetch.Request

class QueuingService {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  async send (queueId, message) {
    const url = `${this.baseUrl}/${queueId}`
    const body = base64url.encode(Buffer.from(message))
    const response = await fetch(new Request(url, { method: 'POST', body }))
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
    return base64url.toBuffer(await response.text())
  }
}

export { QueuingService }
