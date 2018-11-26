import Cache from 'lru-cache'

export const maximumQueueSize = 10
export const maximumMessageLength = 100000

export class SocketServer {
  constructor () {
    this.clients = []
    this.pendingMessages = Cache({ maxAge: 10 * 60 * 1000 })
    setInterval(() => {
      this.pendingMessages.prune()
    }, 60 * 1000)
  }

  onConnection (clientSocket) {
    // console.debug('connected')
    clientSocket.on('identify', queueId => {
      // console.debug('identify: ', queueId)
      this.onIdentify(clientSocket, queueId)
    })
    clientSocket.on('message', message => {
      // console.debug('message: ', message)
      this.onMessage(clientSocket, message)
    })
    clientSocket.on('disconnect', reason => {
      // console.debug('disconnect: ', clientSocket.queueId)
      this.onDisconnect(clientSocket)
    })
  }

  onIdentify (clientSocket, queueId) {
    let clientsForQueue = this.clients[queueId] || []
    if (clientsForQueue.length > 1) {
      clientSocket.emit('error', 'too many clients for queue')
      return
    }

    clientsForQueue.push(clientSocket)
    this.clients[queueId] = clientsForQueue
    clientSocket.queueId = queueId
    this.deliverPendingMessages(clientSocket)
  }

  deliverPendingMessages (clientSocket) {
    const queueId = clientSocket.queueId
    const pending = this.pendingMessages.get(queueId)
    if (pending) {
      pending.map(message => {
        // console.debug('deliver pending message')
        clientSocket.send(message)
      })
      this.pendingMessages.del(queueId)
    }
  }

  onMessage (source, message) {
    if (!this.verifyMessage(message)) {
      source.emit('error', 'message too long')
      return
    }

    const receiver = this.findReceiver(source)
    if (receiver) {
      // console.debug('deliver message')
      receiver.send(message)
    } else {
      this.addPendingMessage(source, message)
    }
  }

  verifyMessage (message) {
    return message.length <= maximumMessageLength
  }

  onDisconnect (clientSocket) {
    // todo this.clients[clientSocket.queueId] may be undefined
    if (!clientSocket.queueId) {
      return /* investigate! */
    }
    const remainingClients = this.clients[clientSocket.queueId].filter(c => {
      return clientSocket !== c
    })
    if (remainingClients.length === 0) {
      delete this.clients[clientSocket.queueId]
    } else {
      this.clients[clientSocket.queueId] = remainingClients
    }
  }

  findReceiver (source) {
    const receivers = this.clients[source.queueId].filter(c => {
      return source !== c && source.queueId === c.queueId
    })
    return receivers.length === 1 ? receivers[0] : undefined
  }

  addPendingMessage (source, message) {
    let queueId = source.queueId
    let pendingMessages = this.pendingMessages.get(queueId) || []
    if (pendingMessages.length === maximumQueueSize) {
      source.emit('error', 'too many pending messages')
      return
    }

    pendingMessages.push(message)
    this.pendingMessages.set(queueId, pendingMessages)
  }
}

export default class IOSocketServer {
  constructor (io) {
    this.socketServer = new SocketServer()
    this.io = io
  }

  start () {
    this.io.on('connection', socket => {
      this.socketServer.onConnection(socket)
    })
  }
}
