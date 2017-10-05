const expect = require('chai').expect
const td = require('testdouble')
const sodium = require('libsodium-wrappers')
const random = sodium.randombytes_buf
const nonceSize = sodium.crypto_secretbox_NONCEBYTES
const keySize = sodium.crypto_secretbox_KEYBYTES
const decrypt = sodium.crypto_secretbox_open_easy
const { SecureChannel } = require('../lib/secure-channel')

describe('secure-channel', function () {
  const channelId = 'channel_id'
  const key = random(keySize)

  let channel
  let queuing

  beforeEach(function () {
    queuing = td.object()
    channel = new SecureChannel({ queuing, id: channelId, key })
  })

  context('when sending a message', function () {
    const message = 'a message'

    beforeEach(function () {
      channel.send(message)
    })

    it('encrypts the message', function () {
      const captor = td.matchers.captor()
      td.verify(queuing.send(td.matchers.anything(), captor.capture()))
      const nonceAndCypherText = captor.value
      const nonce = nonceAndCypherText.slice(0, nonceSize)
      const cypherText = nonceAndCypherText.slice(nonceSize)
      expect(decrypt(cypherText, nonce, key, 'text')).to.equal(message)
    })

    it('uses the red queue', function () {
      td.verify(queuing.send(channelId + '.red', td.matchers.anything()))
    })
  })
})
