import { CogitoEthereum } from './'
import { proxiesFromBlobs } from './proxiesFromBlobs'

jest.mock('./proxiesFromBlobs')

describe('CogitoEthereum', () => {
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  // prettier-ignore
  const exampleTelepathKey = new Uint8Array([
    176, 8, 86, 89, 0, 33, 4, 124, 240, 249, 253, 251, 147, 56, 138, 54,
    84, 144, 150, 125, 89, 4, 6, 6, 217, 246, 16, 163, 188, 247, 113, 134
  ])

  const SimpleStorage = () => ({
    contractName: jest.fn(),
    deployed: jest.fn()
  })

  const blobs = [SimpleStorage()]
  const appName = 'Cogito Demo App'
  let ethereum
  let cogitoEthereum

  const prepareChannel = telepathChannel => {
    telepathChannel.setMockedReceive({
      jsonrpc: '2.0',
      id: 42,
      result: [ethereum.address]
    })
  }

  beforeEach(() => {
    ethereum = {
      address: '0x9C66B52bb71DD7E146944DFdad5784Bf7217A6B6',
      useTelepathChannel: jest.fn()
    }
    console.log = jest.fn()
    cogitoEthereum = new CogitoEthereum(blobs)
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  it('accepts telepath queuing service url as constructor argument', async () => {
    const baseUrl = 'https://alternative.telepath.provider'
    const cogitoEthereum = new CogitoEthereum(blobs, baseUrl)

    const { cogitoWeb3, telepathChannel } = await cogitoEthereum.getContext({
      appName
    })

    prepareChannel(telepathChannel)

    await cogitoWeb3.eth.getAccounts()
    expect(telepathChannel.sent.method).toBe('accounts')
  })

  it('uses default telepath queuing service url if not provided', async () => {
    const baseUrl = 'https://telepath.cogito.mobi'
    expect(cogitoEthereum.telepath.serviceUrl).toBe(baseUrl)
  })

  it('provides Web3 object with CogitoProvider', async () => {
    const { cogitoWeb3, telepathChannel } = await cogitoEthereum.getContext({
      appName
    })

    prepareChannel(telepathChannel)

    expect(await cogitoWeb3.eth.getAccounts()).toEqual([ethereum.address])
  })

  it('provides a new telepath channel when no channel id and key are provided', async () => {
    const { telepathChannel } = await cogitoEthereum.getContext({
      appName
    })

    expect(telepathChannel.id).toBeDefined()
    expect(telepathChannel.key).toBeDefined()
    expect(telepathChannel.appName).toBe(appName)
  })

  it('provides a telepath channel with provided channel id and key', async () => {
    const { telepathChannel } = await cogitoEthereum.getContext({
      channelId: exampleTelepathId,
      channelKey: exampleTelepathKey,
      appName
    })

    expect(telepathChannel.id).toBe(exampleTelepathId)
    expect(telepathChannel.key).toEqual(exampleTelepathKey)
    expect(telepathChannel.appName).toBe(appName)
  })

  describe('when contracts are deployed', () => {
    it('can execute contract using provided proxy and cogito provider', async () => {
      const { telepathChannel, cogitoWeb3 } = await cogitoEthereum.getContext({
        appName
      })

      ethereum.useTelepathChannel(telepathChannel)
      expect(proxiesFromBlobs).toBeCalledWith(expect.anything(), cogitoWeb3)
    })
  })
})
