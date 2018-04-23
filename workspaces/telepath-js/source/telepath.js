import base64url from 'base64url'
import { random, keySize } from '@cogitojs/crypto'
import { SecureChannel } from './secure-channel'
import { JsonRpcChannel } from './json-rpc-channel'
import { QueuingService } from './queuing-service'

class Telepath {
  constructor (queuingServiceUrl) {
    this.queuing = new QueuingService(queuingServiceUrl)
  }

  async createChannel ({ id, key } = {}) {
    const channelId = id || await createRandomId()
    const channelKey = key || await createRandomKey()
    const channel = new SecureChannel({
      id: channelId,
      key: channelKey,
      queuing: this.queuing
    })
    return new JsonRpcChannel({ channel })
  }
}

async function createRandomId () {
  const idSize = 18
  const idBytes = await random(idSize)
  const idString = base64url.encode(idBytes)
  return idString
}

async function createRandomKey () {
  return random(await keySize())
}

export { Telepath }
