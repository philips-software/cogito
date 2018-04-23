import base64url from 'base64url'
import { random, encrypt, decrypt, nonceSize } from '@cogitojs/crypto'
import { Poller } from './poller'

class SecureChannel {
  constructor ({ queuing, id, key }) {
    this.queuing = queuing
    this.id = id
    this.key = key
    this.poller = new Poller({
      pollFunction: () => queuing.receive(`${id}.blue`),
      interval: 1000,
      retries: 600
    })
  }

  async send (message) {
    const queueId = `${this.id}.red`
    const nonce = await random(await nonceSize())
    const plainText = new Uint8Array(Buffer.from(message))
    const cypherText = await encrypt(plainText, nonce, this.key)
    const nonceAndCypherText = Buffer.concat([Buffer.from(nonce), Buffer.from(cypherText)])
    await this.queuing.send(queueId, nonceAndCypherText)
  }

  async receive () {
    const received = await this.poller.poll()
    if (!received) {
      return null
    }
    const nonceAndCypherText = new Uint8Array(received)
    const nonce = nonceAndCypherText.slice(0, await nonceSize())
    const cypherText = nonceAndCypherText.slice(await nonceSize())
    return decrypt(cypherText, nonce, this.key, 'text')
  }

  createConnectUrl (baseUrl) {
    const encodedKey = base64url.encode(this.key)
    return `${baseUrl}/telepath/connect#I=${this.id}&E=${encodedKey}`
  }
}

export { SecureChannel }
