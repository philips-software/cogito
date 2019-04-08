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
    await verifyResponseOk({ response, message: 'Failed to send message' })
  }

  async receive (queueId) {
    const response = await fetch(`${this.baseUrl}/${queueId}`)
    await verifyResponseOk({ response, message: 'Failed to receive message' })
    if (response.status === 204) {
      return null
    }
    return base64url.toBuffer(await response.text())
  }
}

const verifyResponseOk = async ({ response, message }) => {
  if (!response.ok) {
    const status = response.status
    const text = await response.text()
    throw new Error(`${message} (${status}): ${text}`)
  }
}

export { QueuingService }
