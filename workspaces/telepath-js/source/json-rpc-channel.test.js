import { JsonRpcChannel } from './json-rpc-channel'

describe('JSON RPC Channel', () => {
  const request = { jsonrpc: '2.0', id: 1, method: 'foo' }
  const response = { jsonrpc: '2.0', id: 1, result: 'bar' }

  let jsonrpc
  let channel

  beforeEach(() => {
    channel = {
      send: jest.fn(),
      receive: jest.fn(),
      notify: jest.fn(),
      createConnectUrl: jest.fn(),
      startNotifications: jest.fn()
    }
    jsonrpc = new JsonRpcChannel({ channel })
  })

  describe('when a valid response is available', () => {
    beforeEach(() => {
      channel.send.mockImplementation(sentRequest => {
        if (sentRequest === JSON.stringify(request)) {
          channel.receive.mockResolvedValue(JSON.stringify(response))
        }
      })
    })

    it('returns the response that is received', async () => {
      expect(await jsonrpc.send(request)).toEqual(response)
    })

    it('throws when request is not a json rpc 2.0 request', async () => {
      const wrongRequest = { jsonrpc: '0.42', id: 1, method: 'test' }
      await expect(jsonrpc.send(wrongRequest)).rejects.toThrow()
    })

    it('throws when request does not have an id', async () => {
      const wrongRequest = { jsonrpc: '2.0', method: 'test' }
      await expect(jsonrpc.send(wrongRequest)).rejects.toThrow()
    })

    it('throws when request does not specify a method', async () => {
      const wrongRequest = { jsonrpc: '2.0', id: 1 }
      await expect(jsonrpc.send(wrongRequest)).rejects.toThrow()
    })
  })

  it('ignores responses that are not json', async () => {
    channel.receive
      .mockResolvedValueOnce('invalid json')
      .mockResolvedValue(JSON.stringify(response))
    expect(await jsonrpc.send(request)).toEqual(response)
  })

  it('ignores responses with the wrong id', async () => {
    channel.receive
      .mockResolvedValueOnce(
        JSON.stringify({ jsonrpc: '2.0', id: 0, result: null })
      )
      .mockResolvedValue(JSON.stringify(response))
    expect(await jsonrpc.send(request)).toEqual(response)
  })

  it('throws when response times out', async () => {
    channel.receive.mockResolvedValue(null)
    await expect(jsonrpc.send(request)).rejects.toThrow()
  })

  it('can create a connect url', () => {
    const baseUrl = 'https://example.com'
    const url = 'https://example.com#connect'
    channel.createConnectUrl.mockReturnValue(url)

    const connectUrl = jsonrpc.createConnectUrl(baseUrl)

    expect(channel.createConnectUrl.mock.calls[0][0]).toEqual(baseUrl)
    expect(connectUrl).toEqual(url)
  })

  it('exposes id of the underlying secure channel', () => {
    const id = 'channel id'
    channel.id = id

    jsonrpc = new JsonRpcChannel({ channel: channel })
    expect(jsonrpc.id).toEqual(id)
  })

  it('exposes the key of the underlying secure channel', () => {
    const key = 'channel key'
    channel.key = key

    jsonrpc = new JsonRpcChannel({ channel: channel })
    expect(jsonrpc.key).toEqual(key)
  })

  it('exposes the appName of the underlying secure channel', () => {
    const appName = 'App Name'
    channel.appName = appName

    jsonrpc = new JsonRpcChannel({ channel: channel })
    expect(jsonrpc.appName).toEqual(appName)
  })

  describe('notifications', () => {
    const notification = { jsonrpc: '2.0', method: 'test' }
    const invalidVersionNotification = { jsonrpc: '0.42', method: 'test' }
    const notificationWithId = { jsonrpc: '2.0', id: 1, method: 'test' }
    const notificationWithoutMethod = { jsonrpc: '2.0' }

    describe('outgoing', () => {
      it('hands valid notification over to secure channel', async () => {
        await jsonrpc.notify(notification)
        expect(channel.notify.mock.calls[0][0]).toEqual(
          JSON.stringify(notification)
        )
      })

      it('throws when notification is not a json rpc 2.0 structure', async () => {
        await expect(
          jsonrpc.notify(invalidVersionNotification)
        ).rejects.toThrow()
      })

      it('throws when notification has an id', async () => {
        await expect(jsonrpc.notify(notificationWithId)).rejects.toThrow()
      })

      it('throws when notification does not specify a method', async () => {
        await expect(
          jsonrpc.notify(notificationWithoutMethod)
        ).rejects.toThrow()
      })
    })

    describe('incoming', () => {
      let notificationHandler
      let channelNotificationHandler

      beforeEach(async () => {
        notificationHandler = jest.fn()
        await jsonrpc.startNotifications()
        jsonrpc.subscribeForNotifications(notificationHandler)
        channelNotificationHandler = channel.startNotifications.mock.calls[0][0]
      })

      it('passes incoming notifications on', () => {
        channelNotificationHandler(JSON.stringify(notification))
        expect(notificationHandler).toBeCalledWith(notification)
      })

      it('ignores notification that is not a json rpc 2.0 structure', () => {
        const wrongMessage = JSON.stringify(invalidVersionNotification)
        channelNotificationHandler(wrongMessage)
        expect(notificationHandler).not.toBeCalled()
      })

      it('ignores notification that has an id', () => {
        const wrongMessage = JSON.stringify(notificationWithId)
        channelNotificationHandler(wrongMessage)
        expect(notificationHandler).not.toBeCalled()
      })

      it('ignores notification without method', () => {
        const wrongMessage = JSON.stringify(notificationWithoutMethod)
        channelNotificationHandler(wrongMessage)
        expect(notificationHandler).not.toBeCalled()
      })
    })
  })
})
