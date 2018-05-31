import { CogitoAccount } from './cogito-account'

describe('cogito account', () => {
  const channel = { send: jest.fn() }
  const ethereumAddress = '0xsomeAddress'
  const username = 'some user name'
  const account = new CogitoAccount({ channel })
  const requestedProperties = [
    CogitoAccount.Property.EthereumAddress,
    CogitoAccount.Property.Username
  ]

  it('creates CogitoAccount with channel', () => {
    expect(account.channel).toBe(channel)
  })

  describe('when telepath returns result', () => {
    const response = {
      jsonrpc: '2.0',
      result: {
        ethereumAddress,
        username
      }
    }

    beforeEach(() => {
      channel.send.mockReturnValueOnce(Promise.resolve(response))
    })

    it('sends proper telepath request', async () => {
      await account.getAccountInfo({ properties: requestedProperties })
      const expectedRequest = {
        jsonrpc: '2.0',
        method: 'getAccountInfo',
        params: { properties: requestedProperties }
      }
      let actualRequest = channel.send.mock.calls[0][0]
      expect(actualRequest.id).toBeDefined()
      actualRequest.id = undefined
      expect(actualRequest).toEqual(expectedRequest)
    })

    it('returns account info from telepath response', async () => {
      const properties = await account.getAccountInfo({ properties: requestedProperties })
      expect(properties.ethereumAddress).toEqual(ethereumAddress)
      expect(properties.username).toEqual(username)
    })
  })

  describe('when telepath returns error', () => {
    const response = {
      jsonrpc: '2.0',
      error: { code: 42, message: 'some message' }
    }

    beforeEach(() => {
      channel.send.mockReturnValueOnce(Promise.resolve(response))
    })

    it('throws', async () => {
      expect.assertions(1)
      await expect(account.getAccountInfo({ properties: requestedProperties })).rejects.toBeDefined()
    })
  })

  describe('when no or less properties than requested are returned', () => {
    const response = {
      jsonrpc: '2.0',
      result: {}
    }

    beforeEach(() => {
      channel.send.mockReturnValueOnce(Promise.resolve(response))
    })

    it('this is not an error', async () => {
      const properties = await account.getAccountInfo({ properties: requestedProperties })
      expect(properties).toEqual({})
    })
  })
})
