import { proxiesFromBlobs } from './proxiesFromBlobs'
import initContract from 'truffle-contract'

jest.mock('truffle-contract')

describe('proxiesFromBlobs', () => {
  let blobs
  let web3
  let contractProxy

  const SimpleStorage = () => ({
    contractName: 'SimpleStorage',
    deployed: jest.fn()
  })

  beforeEach(() => {
    blobs = [SimpleStorage()]
    contractProxy = {
      setProvider: jest.fn()
    }
    web3 = {
      currentProvider: {}
    }
    initContract.mockReturnValue(contractProxy)
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

  it('takes a list with contract JSONs and returns proxies', async () => {
    const proxies = proxiesFromBlobs(blobs, web3)
    expect(proxies['SimpleStorage']).toEqual(contractProxy)
  })
})
