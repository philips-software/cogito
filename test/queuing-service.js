/* eslint-env mocha */
const expect = require('chai').expect
const nock = require('nock')
const QueuingService = require('../lib/queuing-service')

describe('Queuing Service', function () {
  const baseUrl = 'https://queuing.example.com'
  const queueId = 'a_queue_id'
  const message = 'a message'

  let queuing

  beforeEach(function () {
    queuing = new QueuingService(baseUrl)
  })

  afterEach(function () {
    nock.cleanAll()
  })

  it('can send a message', async function () {
    const post = nock(`${baseUrl}`).post(`/${queueId}`, message).reply(200)
    await queuing.send(queueId, message)
    expect(post.isDone()).to.be.true()
  })

  it('throws when sending fails', async function () {
    nock(`${baseUrl}`).post(`/${queueId}`, message).reply(500)
    await expect(queuing.send(queueId, message)).to.be.rejected()
  })
})
