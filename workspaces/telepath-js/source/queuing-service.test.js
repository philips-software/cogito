import nock from 'nock'
import base64url from 'base64url'
import { QueuingService } from './queuing-service'

describe('Queuing Service', () => {
  const baseUrl = 'https://queuing.example.com'
  const queueId = 'a_queue_id'
  const message = Buffer.from('a message')
  const encodedMessage = base64url.encode(message)

  let queuing

  beforeEach(() => {
    queuing = new QueuingService(baseUrl)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('can send a message', async () => {
    const post = nock(baseUrl).post(`/${queueId}`, encodedMessage).reply(200)
    await queuing.send(queueId, message)
    expect(post.isDone()).toBeTruthy()
  })

  it('throws when sending fails', async () => {
    nock(baseUrl).post(`/${queueId}`, encodedMessage).reply(500, 'message')
    await expect(queuing.send(queueId, message)).rejects.toThrow(/message/)
  })

  it('can receive a message', async () => {
    nock(baseUrl).get(`/${queueId}`).reply(200, encodedMessage)
    await expect(queuing.receive(queueId)).resolves.toEqual(message)
  })

  it('returns null when queue is empty', async () => {
    nock(baseUrl).get(`/${queueId}`).reply(204)
    await expect(queuing.receive(queueId)).resolves.toEqual(null)
  })

  it('throws when receiving fails', async () => {
    nock(baseUrl).get(`/${queueId}`).reply(500, 'message')
    await expect(queuing.receive(queueId)).rejects.toThrow(/message/)
  })
})
