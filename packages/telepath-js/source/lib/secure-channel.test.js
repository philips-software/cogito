const td = require('testdouble')
const anything = td.matchers.anything
const { random, encrypt, decrypt, keySize, nonceSize } = require('./crypto')
const base64url = require('base64url')
const SecureChannel = require('./secure-channel')

describe('Secure Channel', () => {
  const channelId = 'channel_id'
  const blueQueue = `${channelId}.blue`
  const redQueue = `${channelId}.red`
  const message = 'a message'

  let channel
  let queuing
  let key

  beforeEach(async () => {
    key = await random(await keySize())
    queuing = td.object()
    channel = new SecureChannel({ queuing, id: channelId, key })
    channel.poller.interval = 0
    channel.poller.retries = 10
  })

  afterEach(() => {
    td.reset()
  })

  describe('when sending a message', () => {
    beforeEach(async () => {
      await channel.send(message)
    })

    it('encrypts the message', async () => {
      const captor = td.matchers.captor()
      td.verify(queuing.send(anything(), captor.capture()))
      const nonceAndCypherText = new Uint8Array(captor.value)
      const nonce = nonceAndCypherText.slice(0, await nonceSize())
      const cypherText = nonceAndCypherText.slice(await nonceSize())
      expect(await decrypt(cypherText, nonce, key, 'text')).toEqual(message)
    })

    it('uses the red queue', () => {
      td.verify(queuing.send(redQueue, anything()))
    })
  })

  describe('when receiving a message (on the blue queue)', () => {
    function whenReceiving (...messages) {
      td.when(queuing.receive(blueQueue)).thenResolve(...messages)
    }

    async function enc (message) {
      const nonce = await random(await nonceSize())
      const plainText = new Uint8Array(Buffer.from(message))
      const cypherText = await encrypt(plainText, nonce, key)
      return Buffer.concat([nonce, cypherText])
    }

    it('decrypts the message', async () => {
      whenReceiving(await enc(message))
      expect(await channel.receive()).toEqual(message)
    })

    it('waits for a message to become available', async () => {
      whenReceiving(null, null, await enc(message))
      expect(await channel.receive()).toEqual(message)
    })
  })

  describe('errors', () => {
    it('throws when there is an error while sending', async () => {
      td.when(queuing.send(anything(), anything())).thenReject('an error')
      await expect(channel.send('a message')).rejects.toThrow()
    })

    it('throws when there is an error while receiving', async () => {
      td.when(queuing.receive(blueQueue)).thenReject('an error')
      await expect(channel.receive()).rejects.toThrow()
    })

    it('throws when there is an error while decrypting', async () => {
      td.when(queuing.receive(blueQueue)).thenResolve('invalid data')
      await expect(channel.receive()).rejects.toThrow()
    })
  })

  it('receives null when no message is waiting', async () => {
    td.when(queuing.receive(blueQueue)).thenResolve(null)
    await expect(channel.receive()).resolves.toBeNull()
  })

  it('has sensible polling parameters', () => {
    const channel = new SecureChannel({})
    expect(channel.poller.interval).toEqual(1000) // 1000 ms
    expect(channel.poller.retries).toEqual(600) // at least 10 minutes
  })

  it('encodes the channel id and key in a URL', () => {
    const baseUrl = 'https://example.com'
    const encodedKey = base64url.encode(key)
    const url = `${baseUrl}/telepath/connect#I=${channelId}&E=${encodedKey}`
    expect(channel.createConnectUrl(baseUrl)).toEqual(url)
  })
})
