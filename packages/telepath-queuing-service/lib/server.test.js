import request from 'supertest'
import createServer from './server'

describe('Server', () => {
  const queueId = 'a_queue_id'

  let server

  beforeEach(() => {
    server = createServer()
  })

  it('receives messages that have been sent', async () => {
    const message = 'a message'
    await request(server).post(`/${queueId}`).send(message)
    await request(server).get(`/${queueId}`).expect(200).expect(message)
  })

  it('delivers messages in fifo order', async () => {
    await request(server).post(`/${queueId}`).send('message 1')
    await request(server).post(`/${queueId}`).send('message 2')
    await request(server).get(`/${queueId}`).expect('message 1')
    await request(server).get(`/${queueId}`).expect('message 2')
  })

  it('delivers messages to the correct queue', async () => {
    await request(server).post(`/queueA`).send('messageA')
    await request(server).post(`/queueB`).send('messageB')
    await request(server).get(`/queueB`).expect('messageB')
    await request(server).get(`/queueA`).expect('messageA')
  })

  it('returns status code 204 when queue is empty', async () => {
    await request(server).post(`/${queueId}`).send('message')
    await request(server).get(`/${queueId}`)
    await request(server).get(`/${queueId}`).expect(204)
  })

  it('returns status code 204 when queue is non-existent', async () => {
    await request(server).get('/non-existent').expect(204)
  })
})
