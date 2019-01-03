import { EthereumForSimpleStorage } from 'test-helpers'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'
import { CogitoEthereum } from './'

describe('CogitoEthereum', () => {
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  const exampleTelepathKey = new Uint8Array([176, 8, 86, 89, 0, 33, 4, 124, 240, 249, 253, 251, 147, 56, 138, 54, 84, 144, 150, 125, 89, 4, 6, 6, 217, 246, 16, 163, 188, 247, 113, 134])
  const blobs = [ SimpleStorage() ]
  const appName = 'Cogito Demo App'
  let ethereum

  beforeEach(() => {
    ethereum = new EthereumForSimpleStorage({ appName })
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  it('provides Web3 object with CogitoProvider', async () => {
    const cogitoEthereum = new CogitoEthereum(blobs)

    const { cogitoWeb3, telepathChannel } = await cogitoEthereum.getContext({ appName })

    ethereum.useTelepathChannel(telepathChannel)

    expect(await cogitoWeb3.eth.getAccounts()).toEqual([
      ethereum.address
    ])
  })

  it('provides a new telepath channel when no channel id and key are provided', async () => {
    const cogitoEthereum = new CogitoEthereum(blobs)

    const { telepathChannel } = await cogitoEthereum.getContext({
      channelId: exampleTelepathId,
      channelKey: exampleTelepathKey,
      appName
    })

    expect(telepathChannel.id).toBe(exampleTelepathId)
    expect(telepathChannel.key).toEqual(exampleTelepathKey)
    expect(telepathChannel.appName).toBe(appName)
  })

  it('provides a telepath channel with provided channel id and key', async () => {
    const cogitoEthereum = new CogitoEthereum(blobs)

    const { telepathChannel } = await cogitoEthereum.getContext({ appName })

    expect(telepathChannel.id).toBeDefined()
    expect(telepathChannel.key).toBeDefined()
    expect(telepathChannel.appName).toBe(appName)
  })

  describe('when contracts are deployed', () => {
    const increment = 5
    let cogitoEthereum

    beforeEach(async () => {
      ethereum = await EthereumForSimpleStorage.setup()
      cogitoEthereum = new CogitoEthereum([ethereum.simpleStorageBlob])
    })

    it('can execute contract using provided proxy and cogito provider', async () => {
      const { contractsProxies, telepathChannel } = await cogitoEthereum.getContext({ appName })

      ethereum.useTelepathChannel(telepathChannel)

      const simpleStorage = await contractsProxies.SimpleStorage.deployed()
      await simpleStorage.increase(increment, { from: ethereum.address })
      const value = (await simpleStorage.read()).toNumber()

      expect(value).toBe(5)
    })
  })
})
