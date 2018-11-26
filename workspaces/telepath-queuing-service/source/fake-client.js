export default class FakeClientSocket {
  connect (socketServer) {
    this.eventHandlers = []
    this.outgoing = []
    this.socketServer = socketServer
    socketServer.onConnection(this)
  }

  receiveIncoming (event, message) {
    if (event === 'identify') {
      this.queueId = message
    }
    this.eventHandlers[event](message)
  }

  send (message) {
    this.outgoing.push({ event: 'message', payload: message })
  }

  emit (event, payload) {
    this.outgoing.push({ event, payload })
  }

  on (event, callback) {
    this.eventHandlers[event] = callback
  }
}
