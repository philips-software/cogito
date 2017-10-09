
const sodium = require('libsodium-wrappers')
const random = sodium.randombytes_buf
const nonceSize = sodium.crypto_secretbox_NONCEBYTES
const encrypt = sodium.crypto_secretbox_easy
const decrypt = sodium.crypto_secretbox_open_easy

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
}

module.exports = SecureChannel
