import base64url from 'base64url'
import { random, keySize } from '@cogitojs/crypto'
import { SecureChannel } from './secure-channel'
import { JsonRpcChannel } from './json-rpc-channel'
import { QueuingService } from './queuing-service'
import { SocketIOService } from './socket-io-service'
import io from 'socket.io-client'

class Telepath {
  constructor (serviceUrl) {
    this.queuing = new QueuingService(serviceUrl)
    const socket = io(serviceUrl, { autoConnect: false })
    this.socketIOService = new SocketIOService(socket)
  }

  async createChannel ({ id, key, appName }) {
    if (!appName) {
      throw new Error('appName is a required parameter')
    }
    const channelId = id || (await createRandomId())
    const channelKey = key || (await createRandomKey())
    const channel = new SecureChannel({
      id: channelId,
      key: channelKey,
      appName: appName,
      queuing: this.queuing,
      socketIOService: this.socketIOService
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
