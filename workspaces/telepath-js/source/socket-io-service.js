import base64url from 'base64url'

export class SocketIOService {
  constructor (socketIOClient) {
    this.socketIOClient = socketIOClient
    this.pendingNotifications = []
    this.setupDone = false
  }

  start (channelID, onNotificationCallback) {
    return new Promise((resolve, reject) => {
      this.socket = this.socketIOClient.connect()
      this.socket.on('connect', () => {
        this.socket.emit('identify', channelID, () => {
          this.sendPendingNotifications()
        })
      })
      this.socket.on('notification', message => {
        onNotificationCallback(base64url.toBuffer(message))
      })
      resolve()
    })
  }

  notify (data) {
    const message = base64url.encode(data)
    if (this.setupDone) {
      this.socket.emit('notification', message)
    } else {
      this.pendingNotifications.push(message)
    }
  }

  sendPendingNotifications () {
    this.pendingNotifications.forEach(message => {
      this.socket.emit('notification', message)
    })
    this.pendingNotifications = []
    this.setupDone = true
  }
}
