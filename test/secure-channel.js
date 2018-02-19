/* eslint-env mocha */
const chai = require('chai')
const expect = chai.expect
const td = require('testdouble')
const anything = td.matchers.anything
const { random, encrypt, decrypt, keySize, nonceSize } = require('../lib/crypto')
const base64url = require('base64url')
const SecureChannel = require('../lib/secure-channel')

describe('Secure Channel', function () {
  const channelId = 'channel_id'
  const blueQueue = `${channelId}.blue`
  const redQueue = `${channelId}.red`
  const message = 'a message'

  let channel
  let queuing
  let key

  beforeEach(async function () {
    key = await random(await keySize())
    queuing = td.object()
    channel = new SecureChannel({ queuing, id: channelId, key })
    channel.poller.interval = 0
    channel.poller.retries = 10
  })

  afterEach(function () {
    td.reset()
  })

  context('when sending a message', function () {
    beforeEach(async function () {
      await channel.send(message)
    })

    it('encrypts the message', async function () {
      const captor = td.matchers.captor()
      td.verify(queuing.send(anything(), captor.capture()))
      const nonceAndCypherText = captor.value
      const nonce = nonceAndCypherText.slice(0, await nonceSize())
      const cypherText = nonceAndCypherText.slice(await nonceSize())
      expect(await decrypt(cypherText, nonce, key, 'text')).to.equal(message)
    })

    it('uses the red queue', function () {
      td.verify(queuing.send(redQueue, anything()))
    })
  })

  context('when receiving a message (on the blue queue)', function () {
    function whenReceiving (...messages) {
      td.when(queuing.receive(blueQueue)).thenResolve(...messages)
    }

    async function enc (message) {
      const nonce = Buffer.from(await random(await nonceSize()))
      const cypherText = Buffer.from(await encrypt(Buffer.from(message), nonce, key))
      return Buffer.concat([nonce, cypherText])
    }

    it('decrypts the message', async function () {
      whenReceiving(await enc(message))
      expect(await channel.receive()).to.equal(message)
    })

    it('waits for a message to become available', async function () {
      whenReceiving(null, null, await enc(message))
      expect(await channel.receive()).to.equal(message)
    })
  })

  describe('errors', function () {
    it('throws when there is an error while sending', async function () {
      td.when(queuing.send(anything(), anything())).thenReject('an error')
      await expect(channel.send('a message')).to.be.rejected()
    })

    it('throws when there is an error while receiving', async function () {
      td.when(queuing.receive(blueQueue)).thenReject('an error')
      await expect(channel.receive()).to.be.rejected()
    })

    it('throws when there is an error while decrypting', async function () {
      td.when(queuing.receive(blueQueue)).thenResolve('invalid data')
      await expect(channel.receive()).to.be.rejected()
    })
  })

  it('receives null when no message is waiting', async function () {
    td.when(queuing.receive(blueQueue)).thenResolve(null)
    await expect(channel.receive()).to.eventually.be.null()
  })

  it('has sensible polling parameters', function () {
    const channel = new SecureChannel({})
    expect(channel.poller.interval).to.equal(1000) // 1000 ms
    expect(channel.poller.retries).to.equal(600) // at least 10 minutes
  })

  it('encodes the channel id and key in a URL', function () {
    const baseUrl = 'https://example.com'
    const encodedKey = base64url.encode(key)
    const url = `${baseUrl}/telepath/connect#I=${channelId}&E=${encodedKey}`
    expect(channel.createConnectUrl(baseUrl)).to.equal(url)
  })
})
