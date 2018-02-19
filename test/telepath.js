/* eslint-env mocha */
const chai = require('chai')
const expect = chai.expect
const td = require('testdouble')
const base64url = require('base64url')
const JsonRpcChannel = require('../lib/json-rpc-channel')
const { random, keySize } = td.replace('../lib/crypto')
const Telepath = require('../lib/telepath')

describe('Telepath', function () {
  let telepath
  let queuing

  beforeEach(function () {
    telepath = new Telepath('https://queuing.example.com')
    queuing = td.object()
    telepath.queuing = queuing
  })

  afterEach(function () {
    td.reset()
  })

  context('when creating a new channel', function () {
    const randomId = [1, 2, 3]
    const randomKey = [4, 5, 6]

    let channel

    beforeEach(async function () {
      const idSize = 18
      td.when(random(idSize)).thenResolve(randomId)
      td.when(random(await keySize())).thenResolve(randomKey)
      channel = await telepath.createChannel()
    })

    it('returns a JSON-RPC channel', function () {
      expect(channel).to.be.an.instanceOf(JsonRpcChannel)
    })

    it('uses the queuing service', function () {
      expect(channel.channel.queuing).to.equal(queuing)
    })

    it('has a random id', function () {
      expect(channel.channel.id).to.equal(base64url.encode(randomId))
    })

    it('has a random key', function () {
      expect(channel.channel.key).to.equal(randomKey)
    })

    it('can create a channel with given id and key params', async () => {
      const id = base64url.encode([11, 12, 13])
      const key = [14, 15, 16]
      channel = await telepath.createChannel({ id, key })

      expect(channel.channel.id).to.equal(id)
      expect(channel.channel.key).to.equal(key)
    })
  })
})
