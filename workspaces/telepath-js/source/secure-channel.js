import base64url from 'base64url'
import { random, encrypt, decrypt, nonceSize } from '@cogitojs/crypto'
import { Poller } from './poller'

class SecureChannel {
  constructor ({ queuing, id, key, appName, socketIOService }) {
    this.queuing = queuing
    this.socketIOService = socketIOService
    this.id = id
    this.key = key
    this.appName = appName
    this.poller = new Poller({
      pollFunction: () => queuing.receive(`${id}.blue`),
      interval: 1000,
      retries: 600
    })
  }

  async startNotifications (notificationHandler, errorHandler) {
    this.notificationHandler = notificationHandler
    this.notificationErrorHandler = errorHandler
    await this.socketIOService.start(
      this.id,
      this.onEncryptedNotification.bind(this),
      errorHandler
    )
  }

  async send (message) {
    const queueId = `${this.id}.red`
    const nonceAndCypherText = await this.encrypt(message)
    await this.queuing.send(queueId, nonceAndCypherText)
  }

  async receive () {
    const received = await this.poller.poll()
    if (!received) {
      return null
    }
    return this.decrypt(received)
  }

  async notify (message) {
    const nonceAndCypherText = await this.encrypt(message)
    this.socketIOService.notify(nonceAndCypherText)
  }

  async onEncryptedNotification (data) {
    const message = await this.decrypt(data)
    this.notificationHandler(message)
  }

  async encrypt (message) {
    const nonce = await random(await nonceSize())
    const plainText = new Uint8Array(Buffer.from(message))
    const cypherText = await encrypt(plainText, nonce, this.key)
    return Buffer.concat([Buffer.from(nonce), Buffer.from(cypherText)])
  }

  async decrypt (data) {
    const nonceAndCypherText = new Uint8Array(data)
    const nonce = nonceAndCypherText.slice(0, await nonceSize())
    const cypherText = nonceAndCypherText.slice(await nonceSize())
    return decrypt(cypherText, nonce, this.key, 'text')
  }

  createConnectUrl (baseUrl) {
    const encodedKey = base64url.encode(this.key)
    const encodedAppName = base64url.encode(this.appName)
    return `${baseUrl}/telepath/connect#I=${
      this.id
    }&E=${encodedKey}&A=${encodedAppName}`
  }
}

export { SecureChannel }
