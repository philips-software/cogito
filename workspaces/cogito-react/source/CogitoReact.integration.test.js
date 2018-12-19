import React from 'react'
import { GanacheTestNetwork, CogitoProviderForTesting } from 'test-helpers'
import { render, wait } from 'react-testing-library'
import { CogitoReact } from './CogitoReact'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'
import Web3 from 'web3'

describe('cogito-react integration', () => {
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  const exampleTelepathKey = new Uint8Array([176, 8, 86, 89, 0, 33, 4, 124, 240, 249, 253, 251, 147, 56, 138, 54, 84, 144, 150, 125, 89, 4, 6, 6, 217, 246, 16, 163, 188, 247, 113, 134])
  const appName = 'Cogito Demo App'
  let ganacheTestNetwork
  let channel
  let renderFunction
  let renderFunctionArgs
  let contractsInfo

  const setupRenderPropFunction = () => {
    renderFunctionArgs = {}
    renderFunction = args => {
      Object.assign(renderFunctionArgs, args)
      return null
    }
  }

  const resetRenderPropFunctionArgs = () => {
    renderFunctionArgs = {}
  }

  const setupContractsInfo = (contractDefinition = SimpleStorage) => {
    contractsInfo = {
      rawContractsInfo: [
        {
          contractName: 'simpleStorage',
          contractDefinition
        }
      ],
      deployedContractsInfo: []
    }
  }

  const setupChannel = () => {
    channel = {
      id: exampleTelepathId,
      key: exampleTelepathKey,
      appName
    }
  }

  const convertToArrayLikeObject = uint8Array => {
    return uint8Array.reduce((acc, current, index) => { return { ...acc, [index]: current } }, {})
  }

  const cogitoReact = (channelUpdates = {}) => {
    let channelProps = {
      channelId: channel.id,
      channelKey: channel.key,
      appName: channel.appName,
      ...channelUpdates
    }
    return <CogitoReact
      {...channelProps}
      contracts={contractsInfo}>
      {renderFunction}
    </CogitoReact>
  }

  beforeEach(async () => {
    ganacheTestNetwork = new GanacheTestNetwork()
    window.web3 = ganacheTestNetwork.web3
    process.env.REACT_APP_USE_INJECTED_WEB3 = 'YES'
    console.log = jest.fn()
    setupChannel()
    setupRenderPropFunction()
    setupContractsInfo()
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  it('provides an instance of web3, telepath channel and contracts', async () => {
    render(cogitoReact({
      channelId: undefined,
      channelKey: undefined
    }))

    await wait(() => {
      expect(renderFunctionArgs.web3).toBeDefined()
      expect(renderFunctionArgs.contracts.simpleStorage).toBeDefined()
      expect(renderFunctionArgs.contracts.simpleStorage.deployed).toEqual(expect.any(Function))
      expect(renderFunctionArgs.channel.appName).toBe(appName)
      expect(renderFunctionArgs.channel.key).toEqual(expect.any(Uint8Array))
      expect(renderFunctionArgs.channel.id).toEqual(expect.any(String))
      expect(renderFunctionArgs.newChannel).toEqual(expect.any(Function))
    })
  })

  it('creates channel with supplied channel id and key', async () => {
    render(cogitoReact())

    await wait(() => {
      expect(renderFunctionArgs.channel).toMatchObject(channel)
    })
  })

  it('supports channel in Array-like object format', async () => {
    render(cogitoReact({
      channelKey: convertToArrayLikeObject(channel.key)
    }))

    await wait(() => {
      expect(renderFunctionArgs.channel).toMatchObject(channel)
    })
  })

  describe('when contracts are deployed', function () {
    const increment = 10
    let from

    const executeContract = async () => {
      let simpleStorage = await renderFunctionArgs.contracts.simpleStorage.deployed()
      await simpleStorage.increase(increment, { from })
      const value = await simpleStorage.read()
      return value.toNumber()
    }

    beforeEach(async () => {
      from = (await ganacheTestNetwork.getAccounts())[0]
      const { deployedJSON } = await ganacheTestNetwork.deploy(SimpleStorage, { from })
      setupContractsInfo(deployedJSON)
    })

    const adjustCogitoProviderForTesting = () => {
      const simpleStorage = renderFunctionArgs.contracts.simpleStorage
      const web3 = new Web3(new CogitoProviderForTesting({
        originalCogitoProvider: simpleStorage.web3.currentProvider,
        redirectProvider: window.web3.currentProvider
      }))

      simpleStorage.setProvider(web3.currentProvider)
    }

    it('provides contracts correctly deployed with the given provider', async () => {
      render(cogitoReact({
        channelId: undefined,
        channelKey: undefined
      }))

      await wait(() => {
        expect(renderFunctionArgs.web3).toBeDefined()
      })

      adjustCogitoProviderForTesting()

      expect(await executeContract()).toBe(increment)
    })

    it('provides correctly deployed contracts when channel changes', async () => {
      const { rerender } = render(cogitoReact({
        channelId: undefined,
        channelKey: undefined
      }))

      await wait(() => {
        expect(renderFunctionArgs.web3).toBeDefined()
      })

      resetRenderPropFunctionArgs()

      rerender(cogitoReact())

      await wait(() => {
        expect(renderFunctionArgs.web3).toBeDefined()
      })

      adjustCogitoProviderForTesting()

      expect(await executeContract()).toBe(increment)
    })

    it('provides correctly deployed contracts after calling newChannel function', async () => {
      render(cogitoReact())

      await wait(() => {
        expect(renderFunctionArgs.web3).toBeDefined()
      })

      const newChannel = renderFunctionArgs.newChannel

      resetRenderPropFunctionArgs()

      newChannel()

      await wait(() => {
        expect(renderFunctionArgs.web3).toBeDefined()
      })

      adjustCogitoProviderForTesting()

      expect(await executeContract()).toBe(increment)
    })
  })
})
