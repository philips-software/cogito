import base64url from 'base64url'
import timeoutCallback from 'timeout-callback'

export class SocketIOService {
  constructor (socket) {
    this.socket = socket
    this.pendingNotifications = []
    this.setupDone = false
  }

  async start (
    channelID,
    onNotificationCallback,
    onErrorCallback,
    timeout = 30000
  ) {
    await this.waitUntilConnected()
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'identify',
        channelID,
        timeoutCallback(timeout, e => {
          if (e instanceof Error) {
            reject(e)
          } else {
            this.sendPendingNotifications()
            resolve()
          }
        })
      )
      this.socket.on('notification', message => {
        onNotificationCallback(base64url.toBuffer(message))
      })
      if (onErrorCallback) {
        this.socket.on('error', onErrorCallback)
      }
    })
  }

  waitUntilConnected () {
    return new Promise((resolve, reject) => {
      if (this.socket.connected) {
        resolve()
      } else {
        this.socket.on('connect', () => {
          this.socket.off('connect')
          resolve()
        })
        this.socket.connect()
      }
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
