import { random, encrypt, decrypt, keySize, nonceSize } from '@cogitojs/crypto'
import base64url from 'base64url'
import { SecureChannel } from './secure-channel'

jest.unmock('@cogitojs/crypto')

describe('Secure Channel', () => {
  const channelId = 'channel_id'
  const appName = 'Some app name with unicode characters ✅😎'
  const blueQueue = `${channelId}.blue`
  const redQueue = `${channelId}.red`
  const message = 'a message'

  let channel
  let queuing
  let socketIOService
  let key

  beforeEach(async () => {
    key = await random(await keySize())
    queuing = {
      send: jest.fn(),
      receive: jest.fn()
    }
    socketIOService = {
      start: jest.fn(),
      notify: jest.fn()
    }
    channel = new SecureChannel({
      queuing,
      id: channelId,
      key,
      appName,
      socketIOService
    })
    channel.poller.interval = 0
    channel.poller.retries = 10
  })

  describe('when sending a message', () => {
    beforeEach(async () => {
      await channel.send(message)
    })

    it('encrypts the message', async () => {
      const nonceAndCypherText = new Uint8Array(queuing.send.mock.calls[0][1])
      const nonce = nonceAndCypherText.slice(0, await nonceSize())
      const cypherText = nonceAndCypherText.slice(await nonceSize())
      expect(await decrypt(cypherText, nonce, key, 'text')).toEqual(message)
    })

    it('uses the red queue', () => {
      expect(queuing.send.mock.calls[0][0]).toEqual(redQueue)
    })
  })

  async function enc (message) {
    const nonce = await random(await nonceSize())
    const plainText = new Uint8Array(Buffer.from(message))
    const cypherText = await encrypt(plainText, nonce, key)
    return Buffer.concat([nonce, cypherText])
  }

  describe('when receiving a message', () => {
    it('uses the blue queue', async () => {
      await channel.receive()
      expect(queuing.receive.mock.calls[0][0]).toEqual(blueQueue)
    })

    it('decrypts the message', async () => {
      queuing.receive.mockResolvedValueOnce(enc(message))
      expect(await channel.receive()).toEqual(message)
    })

    it('waits for a message to become available', async () => {
      queuing.receive
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(enc(message))
      expect(await channel.receive()).toEqual(message)
    })
  })

  describe('errors', () => {
    it('throws when there is an error while sending', async () => {
      queuing.send.mockRejectedValue(new Error('an error'))
      await expect(channel.send('a message')).rejects.toThrow()
    })

    it('throws when there is an error while receiving', async () => {
      queuing.receive.mockRejectedValue(new Error('an error'))
      await expect(channel.receive()).rejects.toThrow()
    })

    it('throws when there is an error while decrypting', async () => {
      queuing.receive.mockResolvedValue('invalid data')
      await expect(channel.receive()).rejects.toThrow()
    })
  })

  it('receives null when no message is waiting', async () => {
    queuing.receive.mockResolvedValue(null)
    await expect(channel.receive()).resolves.toBeNull()
  })

  it('has sensible polling parameters', () => {
    const channel = new SecureChannel({ socketIOService })
    expect(channel.poller.interval).toEqual(1000) // 1000 ms
    expect(channel.poller.retries).toEqual(600) // at least 10 minutes
  })

  it('encodes the channel id, key and app name in a URL', () => {
    const baseUrl = 'https://example.com'
    const encodedKey = base64url.encode(key)
    const encodedAppName = base64url.encode(appName)
    const url = `${baseUrl}/telepath/connect#I=${channelId}&E=${encodedKey}&A=${encodedAppName}`
    expect(channel.createConnectUrl(baseUrl)).toEqual(url)
  })

  describe('notifications', () => {
    const message = 'plain text message'

    it('encrypts the payload', async () => {
      await channel.notify(message)
      const nonceAndCypherText = new Uint8Array(
        socketIOService.notify.mock.calls[0][0]
      )
      const nonce = nonceAndCypherText.slice(0, await nonceSize())
      const cypherText = nonceAndCypherText.slice(await nonceSize())

      expect(await decrypt(cypherText, nonce, key, 'text')).toBe(message)
    })

    it('decrypts and forwards incoming notifications', async () => {
      const notificationSpy = jest.fn()
      await channel.startNotifications(notificationSpy)
      const data = await enc(message)
      await channel.onEncryptedNotification(data)
      expect(notificationSpy.mock.calls[0][0]).toBe(message)
    })

    it('throws when notification handler is not set', async () => {
      await expect(channel.onEncryptedNotification()).rejects.toThrow()
    })
  })
})
