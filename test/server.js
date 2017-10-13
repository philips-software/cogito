/* eslint-env mocha */
const request = require('supertest')
const createServer = require('../lib/server')

describe('Server', function () {
  const queueId = 'a_queue_id'

  let server

  beforeEach(function () {
    server = createServer()
  })

  it('receives messages that have been sent', async function () {
    const message = 'a message'
    await request(server).post(`/${queueId}`).send(message)
    await request(server).get(`/${queueId}`).expect(200).expect(message)
  })

  it('delivers messages in fifo order', async function () {
    await request(server).post(`/${queueId}`).send('message 1')
    await request(server).post(`/${queueId}`).send('message 2')
    await request(server).get(`/${queueId}`).expect('message 1')
    await request(server).get(`/${queueId}`).expect('message 2')
  })

  it('delivers messages to the correct queue', async function () {
    await request(server).post(`/queueA`).send('messageA')
    await request(server).post(`/queueB`).send('messageB')
    await request(server).get(`/queueB`).expect('messageB')
    await request(server).get(`/queueA`).expect('messageA')
  })

  it('returns status code 204 when queue is empty', async function () {
    await request(server).post(`/${queueId}`).send('message')
    await request(server).get(`/${queueId}`)
    await request(server).get(`/${queueId}`).expect(204)
  })

  it('returns status code 204 when queue is non-existent', async function () {
    await request(server).get('/non-existent').expect(204)
  })
})
