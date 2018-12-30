import { getWeb3 } from './getWeb3'
import Web3 from 'web3'

jest.mock('web3', () => {
  return class {
    static providers = {
      WebsocketProvider: jest.fn(url => ({
        url
      }))
    }
    constructor (provider) {
      this.currentProvider = provider
    }
  }
})

describe('getWeb3', () => {
  beforeEach(() => {
    delete process.env.REACT_APP_USE_INJECTED_WEB3
    delete process.env.REACT_APP_WEB3_PROVIDER_URL
    delete process.env.REACT_APP_WEB3_PROVIDER_URL_PRODUCTION
    delete process.env.NODE_ENV
    delete window.web3
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  describe('when not using injected web3 (default)', () => {
    it('provides Web3 with default localhost websocket provider', async () => {
      const web3 = await getWeb3()

      expect(web3.currentProvider.url).toBe('ws://localhost:8545')
    })

    it('provides Web3 with websocket provider with the url given by REACT_APP_WEB3_PROVIDER_URL', async () => {
      process.env.REACT_APP_WEB3_PROVIDER_URL = 'provider-url-development'
      const web3 = await getWeb3()

      expect(web3.currentProvider.url).toBe(process.env.REACT_APP_WEB3_PROVIDER_URL)
    })

    it('provides Web3 with websocket provider with the url given by REACT_APP_WEB3_PROVIDER_URL_PRODUCTION when in production mode', async () => {
      process.env.NODE_ENV = 'production'
      process.env.REACT_APP_WEB3_PROVIDER_URL_PRODUCTION = 'provider-url-production'
      const web3 = await getWeb3()

      expect(web3.currentProvider.url).toBe(process.env.REACT_APP_WEB3_PROVIDER_URL_PRODUCTION)
    })
  })

  describe('when web3 is injected', () => {
    const injectedProviderUrl = 'injected provider url'
    beforeEach(() => {
      process.env.REACT_APP_USE_INJECTED_WEB3 = 'YES'
      const provider = new Web3.providers.WebsocketProvider('injected provider url')
      window.web3 = new Web3(provider)
    })

    it('provides injected web3', async () => {
      const web3 = await getWeb3()

      expect(web3.currentProvider.url).toBe(injectedProviderUrl)
    })
  })

  describe('when web3 injection is enabled but web3 is not available', () => {
    beforeEach(() => {
      process.env.REACT_APP_USE_INJECTED_WEB3 = 'YES'
    })

    it('provides Web3 with default localhost websocket provider', async () => {
      const web3 = await getWeb3()

      expect(web3.currentProvider.url).toBe('ws://localhost:8545')
    })

    it('provides Web3 with websocket provider with the url given by REACT_APP_WEB3_PROVIDER_URL', async () => {
      process.env.REACT_APP_WEB3_PROVIDER_URL = 'provider-url-development'
      const web3 = await getWeb3()

      expect(web3.currentProvider.url).toBe(process.env.REACT_APP_WEB3_PROVIDER_URL)
    })

    it('provides Web3 with websocket provider with the url given by REACT_APP_WEB3_PROVIDER_URL_PRODUCTION when in production mode', async () => {
      process.env.NODE_ENV = 'production'
      process.env.REACT_APP_WEB3_PROVIDER_URL_PRODUCTION = 'provider-url-production'
      const web3 = await getWeb3()

      expect(web3.currentProvider.url).toBe(process.env.REACT_APP_WEB3_PROVIDER_URL_PRODUCTION)
    })
  })
})
