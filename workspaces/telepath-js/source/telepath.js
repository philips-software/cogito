import base64url from 'base64url'
import { random, keySize } from '@cogitojs/crypto'
import { SecureChannel } from './secure-channel'
import { JsonRpcChannel } from './json-rpc-channel'
import { QueuingService } from './queuing-service'
import { SocketIOService } from './socket-io-service'
import { Manager } from 'socket.io-client'
class Telepath {
  constructor (serviceUrl) {
    this.queuing = new QueuingService(serviceUrl)
    this.socketManager = new Manager(serviceUrl)
  }

  async createChannel ({ id, key, appName }) {
    if (!appName) {
      throw new Error('appName is a required parameter')
    }
    const channelId = id || (await createRandomId())
    const channelKey = key || (await createRandomKey())
    const socket = this.socketManager.socket('/')
    const socketIOService = new SocketIOService(socket)
    const channel = new SecureChannel({
      id: channelId,
      key: channelKey,
      appName: appName,
      queuing: this.queuing,
      socketIOService
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
