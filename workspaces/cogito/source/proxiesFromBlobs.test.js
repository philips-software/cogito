import { SimpleStorage } from '@cogitojs/demo-app-contracts'
import { GanacheTestNetwork } from 'test-helpers'
import { proxiesFromBlobs } from './proxiesFromBlobs'

describe('proxiesFromBlobs', () => {
  let blobs
  let web3

  const setupContracts = () => {
    const baseName = SimpleStorage.contractName
    blobs = [1, 2, 3].map(i => {
      return { ...SimpleStorage, contractName: `${baseName}-${i}` }
    })
  }

  const stubWeb3 = () => {
    web3 = {
      currentProvider: {}
    }
  }

  beforeEach(async () => {
    setupContracts()
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
    let ganacheTestNetwork
    let deployedBlobs
    let from

    const deployContracts = async () => {
      from = (await ganacheTestNetwork.getAccounts())[0]
      const deployments = await Promise.all(blobs.map(blob =>
        ganacheTestNetwork.deploy(blob, { from })
      ))
      deployedBlobs = deployments.map(d => d.deployedJSON)
    }

    beforeEach(async () => {
      ganacheTestNetwork = new GanacheTestNetwork()
      setupContracts()
      await deployContracts()
    })

    it('takes a list with contract JSON blobs and returns object with proxies', async () => {
      const proxies = proxiesFromBlobs(deployedBlobs, ganacheTestNetwork.web3)

      const increments = await Promise.all(Object.values(proxies).map(async (proxy, index) => {
        const contractInstance = await proxy.deployed()
        await contractInstance.increase(index + 1, { from })
        return (await contractInstance.read()).toNumber()
      }))

      expect(increments).toEqual([1, 2, 3])
    })
  })
})
