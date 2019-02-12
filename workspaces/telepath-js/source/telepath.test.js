import base64url from 'base64url'
import { JsonRpcChannel } from './json-rpc-channel'
import { Telepath } from './telepath'
import { random, keySize } from '@cogitojs/crypto'

describe('Telepath', () => {
  const appName = 'some app name'
  let telepath
  let queuing
  let socketIOService

  beforeEach(() => {
    telepath = new Telepath('https://queuing.example.com')
    queuing = {}
    telepath.queuing = queuing
    socketIOService = { start: jest.fn() }
    telepath.socketIOService = socketIOService
  })

  describe('when creating a new channel', () => {
    const fakeRandomId = new Uint8Array(18).fill(1)
    const fakeRandomKey = new Uint8Array(32).fill(2)

    let channel

    beforeEach(async () => {
      random.mockImplementation(async size => {
        if (size === fakeRandomId.length) {
          return fakeRandomId
        } else if (size === fakeRandomKey.length) {
          return fakeRandomKey
        }
      })
      keySize.mockResolvedValue(fakeRandomKey.length)
      channel = await telepath.createChannel({
        appName,
        notificationHandler: jest.fn()
      })
    })

    it('returns a JSON-RPC channel', () => {
      expect(channel).toBeInstanceOf(JsonRpcChannel)
    })

    it('uses the queuing service', () => {
      expect(channel.channel.queuing).toEqual(queuing)
    })

    it('uses the socket io service', () => {
      expect(channel.channel.socketIOService).toEqual(socketIOService)
    })

    it('has a random id', () => {
      expect(channel.channel.id).toEqual(base64url.encode(fakeRandomId))
    })

    it('has a random key', () => {
      expect(channel.channel.key).toEqual(fakeRandomKey)
    })

    it('can create a channel with given id and key params', async () => {
      const id = base64url.encode([1, 2, 3])
      const key = [4, 5, 6]
      channel = await telepath.createChannel({ id, key, appName })

      expect(channel.channel.id).toEqual(id)
      expect(channel.channel.key).toEqual(key)
      expect(channel.channel.appName).toEqual(appName)
    })

    it('throws when no app name is given', async () => {
      const id = base64url.encode([1, 2, 3])
      const key = [4, 5, 6]
      expect.assertions(1)
      await expect(telepath.createChannel({ id, key })).rejects.toBeDefined()
    })
  })
})
