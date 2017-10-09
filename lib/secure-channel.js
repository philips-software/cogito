const base64url = require('base64url')
const { random, encrypt, decrypt, nonceSize } = require('./crypto')

class SecureChannel {
  constructor ({ queuing, id, key }) {
    this.queuing = queuing
    this.id = id
    this.key = key
  }

  send (message) {
    const queueId = `${this.id}.red`
    const nonce = Buffer.from(random(nonceSize))
    const cypherText = Buffer.from(encrypt(Buffer.from(message), nonce, this.key))
    const nonceAndCypherText = Buffer.concat([nonce, cypherText])
    this.queuing.send(queueId, nonceAndCypherText)
  }

  async receive () {
    const nonceAndCypherText = await this.queuing.receive(`${this.id}.blue`)
    const nonce = nonceAndCypherText.slice(0, nonceSize)
    const cypherText = nonceAndCypherText.slice(nonceSize)
    return decrypt(cypherText, nonce, this.key, 'text')
  }

  createConnectUrl (baseUrl) {
    const encodedKey = base64url.encode(this.key)
    return `${baseUrl}/telepath/connect#I=${this.id}&E=${encodedKey}`
  }
}

module.exports = SecureChannel
