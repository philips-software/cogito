import { SimpleStorage } from '@cogitojs/demo-app-contracts'
import { EthereumForSimpleStorage } from 'test-helpers'
import { proxiesFromBlobs } from './proxiesFromBlobs'

describe('proxiesFromBlobs', () => {
  let blobs
  let web3

  const setupContractsBlobs = () => {
    const baseName = SimpleStorage().contractName
    blobs = [1, 2, 3].map(i => {
      return { ...SimpleStorage(), contractName: `${baseName}-${i}` }
    })
  }

  const stubWeb3 = () => {
    web3 = {
      currentProvider: {}
    }
  }

  beforeEach(() => {
    setupContractsBlobs()
    stubWeb3()
  })

  it('each proxy is keyed by the contract name', async () => {
    const proxies = proxiesFromBlobs(blobs, web3)

    const expectedKeys = blobs.map(b => b.contractName)

    expect(Object.keys(proxies)).toEqual(expectedKeys)
  })

  it('returns an empty object if an empty array of blobs is provided', () => {
    expect(proxiesFromBlobs([], web3)).toEqual({})
  })

  it('returns an empty object if blobs argument is undefined', () => {
    expect(proxiesFromBlobs(undefined, web3)).toEqual({})
  })

  it('returns an empty object if web3 is not provided', () => {
    expect(proxiesFromBlobs(blobs)).toEqual({})
  })

  describe('given deployed contracts', () => {
    let ethereum

    beforeEach(async () => {
      console.log = jest.fn()
      ethereum = await EthereumForSimpleStorage.setup({ contractsBlobs: blobs })
    }, 10000)

    afterEach(() => {
      console.log.mockRestore()
    })

    const increment = async (proxy, index) => {
      const contractInstance = await proxy.deployed()
      await contractInstance.increase(index + 1, { from: ethereum.address })
      return (await contractInstance.read()).toNumber()
    }

    it('takes a list with contract JSON blobs and returns object with proxies', async () => {
      const proxies = proxiesFromBlobs(ethereum.deployedJSONs, ethereum.cogitoWeb3)

      // this is a bit tricky - cogito-web3-provider requires that that transactions from the same address
      // are submitted synchronously - otherwise we will get problems with nonces
      // TODO: we should document it in the cogito-web3-provider documentation
      const increments = await Object.values(proxies).reduce(async (promise, proxy, index) => {
        const increments = await promise
        return [ ...increments, await increment(proxy, index) ]
      }, Promise.resolve([]))

      expect(increments).toEqual([1, 2, 3])
    }, 10000)
  })
})
