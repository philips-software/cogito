/* eslint-env mocha */
const expect = require('chai').expect
const nock = require('nock')
const base64url = require('base64url')
const QueuingService = require('../source/lib/queuing-service')

describe('Queuing Service', function () {
  const baseUrl = 'https://queuing.example.com'
  const queueId = 'a_queue_id'
  const message = Buffer.from('a message')
  const encodedMessage = base64url.encode(message)

  let queuing

  beforeEach(function () {
    queuing = new QueuingService(baseUrl)
  })

  afterEach(function () {
    nock.cleanAll()
  })

  it('can send a message', async function () {
    const post = nock(baseUrl).post(`/${queueId}`, encodedMessage).reply(200)
    await queuing.send(queueId, message)
    expect(post.isDone()).to.be.true()
  })

  it('throws when sending fails', async function () {
    nock(baseUrl).post(`/${queueId}`, encodedMessage).reply(500)
    await expect(queuing.send(queueId, message)).to.be.rejected()
  })

  it('can receive a message', async function () {
    nock(baseUrl).get(`/${queueId}`).reply(200, encodedMessage)
    await expect(queuing.receive(queueId)).to.eventually.eql(message)
  })

  it('returns null when queue is empty', async function () {
    nock(baseUrl).get(`/${queueId}`).reply(204)
    await expect(queuing.receive(queueId)).to.eventually.be.null()
  })

  it('throws when receiving fails', async function () {
    nock(baseUrl).get(`/${queueId}`).reply(500)
    await expect(queuing.receive(queueId)).to.be.rejected()
  })
})
