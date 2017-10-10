const base64url = require('base64url')
const { random, keySize } = require('./crypto')
const SecureChannel = require('./secure-channel')

class Telepath {
  constructor ({ queuing }) {
    this.queuing = queuing
  }

  async createChannel () {
    const id = createRandomId()
    const key = createRandomKey()
    await this.queuing.createQueue(`${id}.red`)
    await this.queuing.createQueue(`${id}.blue`)
    return new SecureChannel({ id, key, queuing: this.queuing })
  }
}

function createRandomId () {
  const idSize = 18
  const idBytes = random(idSize)
  const idString = base64url.encode(idBytes)
  return idString
}

function createRandomKey () {
  return random(keySize)
}

module.exports = Telepath
