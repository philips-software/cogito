/* eslint-env mocha */
const request = require('supertest')
const createServer = require('../lib/server')

describe('Server', function () {
  let server

  beforeEach(function () {
    server = createServer()
  })

  context('when a message has been sent', function () {
    const queueId = 'a_queue_id'
    const message = 'a message'

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
})
