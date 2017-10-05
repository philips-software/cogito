
const sodium = require('libsodium-wrappers')
const random = sodium.randombytes_buf
const nonceSize = sodium.crypto_secretbox_NONCEBYTES
const encrypt = sodium.crypto_secretbox_easy

class SecureChannel {
  constructor({ queuing, id, key }) {
    this.queuing = queuing
    this.id = id
    this.key = key
  }

  send(message) {
    const queueId = `${this.id}.red`
    const nonce = Buffer.from(random(nonceSize))
    const cypherText = encrypt(Buffer.from(message), nonce, this.key)
    const nonceAndCypherText = Buffer.concat([nonce, cypherText])
    this.queuing.send(queueId, nonceAndCypherText)
  }
}

module.exports = { SecureChannel }
