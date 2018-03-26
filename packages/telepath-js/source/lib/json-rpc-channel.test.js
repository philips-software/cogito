const JsonRpcChannel = require('./json-rpc-channel')

describe('JSON RPC Channel', () => {
  const request = { jsonrpc: '2.0', id: 1, method: 'foo' }
  const response = { jsonrpc: '2.0', id: 1, result: 'bar' }

  let jsonrpc
  let channel

  beforeEach(() => {
    channel = {
      send: jest.fn(),
      receive: jest.fn(),
      createConnectUrl: jest.fn()
    }
    jsonrpc = new JsonRpcChannel({ channel: channel })
  })

  describe('when a valid response is available', () => {
    beforeEach(() => {
      channel.send.mockImplementation((sentRequest) => {
        if (sentRequest == JSON.stringify(request)) {
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
      .mockResolvedValueOnce(JSON.stringify({jsonrpc:'2.0', id:0, result:null}))
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
})
