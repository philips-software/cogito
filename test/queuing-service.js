/* eslint-env mocha */
const expect = require('chai').expect
const nock = require('nock')
const QueuingService = require('../lib/queuing-service')

describe('Queuing Service', function () {
  const baseUrl = 'https://queuing.example.com'

  let queuing

  beforeEach(function () {
    queuing = new QueuingService(baseUrl)
  })

  afterEach(function () {
    nock.cleanAll()
  })

  it('can send a message', async function () {
    const queueId = 'a_queue_id'
    const message = 'a message'
    const post = nock(`${baseUrl}`).post(`/${queueId}`, message).reply(200)
    await queuing.send(queueId, message)
    expect(post.isDone()).to.be.true()
  })
})
