const base64url = require('base64url')
const { random, keySize } = require('./crypto')
const SecureChannel = require('./secure-channel')
const QueuingService = require('./queuing-service')

class Telepath {
  constructor (queuingServiceUrl) {
    this.queuing = new QueuingService(queuingServiceUrl)
  }

  async createChannel () {
    const id = createRandomId()
    const key = createRandomKey()
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
