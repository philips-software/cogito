import request from 'supertest'
import createServer from './server'
import MockDate from 'mockdate'

jest.useFakeTimers()

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

  it('allows a maximum of 10 messages in a queue', async () => {
    for (var i = 0; i < 10; i++) {
      await request(server).post(`/${queueId}`).send('message').expect(200)
    }
    await request(server).post(`/${queueId}`).send('message').expect(429)
  })

  it('allows a maximum message size of 100000 characters', async () => {
    const notTooBig = Array(100000 + 1).join('a')
    const tooBig = notTooBig + 'a'
    await request(server).post(`/${queueId}`).send(notTooBig).expect(200)
    await request(server).post(`/${queueId}`).send(tooBig).expect(400)
  })

  describe('time to live', async () => {
    const startTime = Date.now()
    const tenMinutes = 10 * 60 * 1000

    beforeEach(() => {
      MockDate.set(startTime)
    })

    afterEach(() => {
      MockDate.reset()
    })

    const forwardTime = (newTime) => {
      MockDate.set(new Date(newTime))
      jest.runOnlyPendingTimers()
    }

    it('retains queues for 10 minutes', async () => {
      await request(server).post(`/${queueId}`).send('message')
      forwardTime(startTime + tenMinutes)
      await request(server).get(`/${queueId}`).expect(200)
    })

    it('purges queues after 10 minutes', async () => {
      await request(server).post(`/${queueId}`).send('message')
      forwardTime(startTime + tenMinutes + 1)
      await request(server).get(`/${queueId}`).expect(204)
    })

    it('retains queues that have been read recently', async () => {
      await request(server).post(`/${queueId}`).send('message1')
      await request(server).post(`/${queueId}`).send('message2')
      forwardTime(startTime + tenMinutes)
      await request(server).get(`/${queueId}`).expect(200)
      forwardTime(startTime + tenMinutes + 1)
      await request(server).get(`/${queueId}`).expect(200)
    })
  })
})
