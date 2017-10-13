/* eslint-env mocha */
const request = require('supertest')
const createServer = require('../lib/server')

describe('Server', function () {
  const queueId = 'a_queue_id'
  const message = 'a message'

  let server

  beforeEach(function () {
    server = createServer()
  })

  context('when a message has been sent', function () {
    beforeEach(async function () {
      await request(server)
        .post(`/${queueId}`)
        .send(message)
    })

    it('can be received', async function () {
      await request(server)
        .get(`/${queueId}`)
        .expect(200)
        .expect(message)
    })
  })

  it('delivers messages in fifo order', async function () {
    await request(server).post(`/${queueId}`).send('message 1')
    await request(server).post(`/${queueId}`).send('message 2')
    await request(server).get(`/${queueId}`).expect('message 1')
    await request(server).get(`/${queueId}`).expect('message 2')
  })
})
