/* eslint-env mocha */
const chai = require('chai')
const expect = chai.expect
const td = require('testdouble')
const base64url = require('base64url')
const crypto = td.replace('../lib/crypto')
const Telepath = require('../lib/telepath')

describe('Telepath', function () {
  let telepath
  let queuing

  beforeEach(function () {
    queuing = td.object()
    telepath = new Telepath({ queuing })
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
      td.when(crypto.random(idSize)).thenReturn(randomId)
      td.when(crypto.random(crypto.keySize)).thenReturn(randomKey)
      channel = await telepath.createChannel()
    })

    it('uses the queuing service', function () {
      expect(channel.queuing).to.equal(queuing)
    })

    it('has a random id', function () {
      expect(channel.id).to.equal(base64url.encode(randomId))
    })

    it('has a random key', function () {
      expect(channel.key).to.equal(randomKey)
    })

    it('creates the red queue', function () {
      td.verify(queuing.createQueue(`${channel.id}.red`))
    })

    it('creates the blue queue', function () {
      td.verify(queuing.createQueue(`${channel.id}.blue`))
    })
  })
})
