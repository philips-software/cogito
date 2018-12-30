import React from 'react'
import { ethers } from 'ethers'
import { GanacheTestNetwork } from 'test-helpers'
import { render, wait } from 'react-testing-library'
import { CogitoReact } from './CogitoReact'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'

describe('cogito-react integration', () => {
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  const exampleTelepathKey = new Uint8Array([176, 8, 86, 89, 0, 33, 4, 124, 240, 249, 253, 251, 147, 56, 138, 54, 84, 144, 150, 125, 89, 4, 6, 6, 217, 246, 16, 163, 188, 247, 113, 134])
  const appName = 'Cogito Demo App'
  let ganacheTestNetwork
  let channel
  let renderFunction
  let renderFunctionArgs
  let contractsBlobs

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

  const setupContractsBlobs = (contractDefinition = SimpleStorage) => {
    contractsBlobs = [ contractDefinition ]
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
      contractsBlobs={contractsBlobs}>
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
    setupContractsBlobs()
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
      expect(renderFunctionArgs.cogitoWeb3).toBeDefined()
      expect(renderFunctionArgs.contractsProxies.SimpleStorage).toBeDefined()
      expect(renderFunctionArgs.contractsProxies.SimpleStorage.deployed).toEqual(expect.any(Function))
      expect(renderFunctionArgs.telepathChannel.appName).toBe(appName)
      expect(renderFunctionArgs.telepathChannel.key).toEqual(expect.any(Uint8Array))
      expect(renderFunctionArgs.telepathChannel.id).toEqual(expect.any(String))
      expect(renderFunctionArgs.newChannel).toEqual(expect.any(Function))
    })
  })

  it('creates channel with supplied channel id and key', async () => {
    render(cogitoReact())

    await wait(() => {
      expect(renderFunctionArgs.telepathChannel).toMatchObject(channel)
    })
  })

  it('supports channel in Array-like object format', async () => {
    render(cogitoReact({
      channelKey: convertToArrayLikeObject(channel.key)
    }))

    await wait(() => {
      expect(renderFunctionArgs.telepathChannel).toMatchObject(channel)
    })
  })

  describe('when contracts are deployed', function () {
    const increment = 10
    const mnemonic = 'hair snack volcano shift tragic wrong wreck release vibrant gossip ugly debate'
    let wallet

    const makeTransactionEthersCompatible = transaction => {
      let ethersTransaction = {
        ...transaction,
        gasLimit: transaction.gas
      }
      delete ethersTransaction.from
      delete ethersTransaction.gas
      return ethersTransaction
    }

    const mockTelepathChannel = telepathChannel => {
      telepathChannel.send = jest.fn().mockImplementationOnce(async signRequest => {
        const transaction = makeTransactionEthersCompatible(signRequest.params[0])
        const signedTransaction = await wallet.sign(transaction)
        return Promise.resolve({
          result: signedTransaction
        })
      })
    }

    const executeContract = async () => {
      let simpleStorage = await renderFunctionArgs.contractsProxies.SimpleStorage.deployed()
      await simpleStorage.increase(increment, { from: wallet.address })
      const value = await simpleStorage.read()
      return value.toNumber()
    }

    beforeEach(async () => {
      wallet = ethers.Wallet.fromMnemonic(mnemonic)
      const { deployedJSON } = await ganacheTestNetwork.deploy(SimpleStorage, { from: wallet.address })
      setupContractsBlobs(deployedJSON)
    })

    it('provides contracts correctly deployed with the given provider', async () => {
      render(cogitoReact({
        channelId: undefined,
        channelKey: undefined
      }))

      await wait(() => {
        expect(renderFunctionArgs.telepathChannel).toBeDefined()
      })

      mockTelepathChannel(renderFunctionArgs.telepathChannel)

      expect(await executeContract()).toBe(increment)
    })

    it('provides correctly deployed contracts when channel changes', async () => {
      const { rerender } = render(cogitoReact({
        channelId: undefined,
        channelKey: undefined
      }))

      await wait(() => {
        expect(renderFunctionArgs.telepathChannel).toBeDefined()
      })

      resetRenderPropFunctionArgs()

      rerender(cogitoReact())

      await wait(() => {
        expect(renderFunctionArgs.telepathChannel).toBeDefined()
      })

      mockTelepathChannel(renderFunctionArgs.telepathChannel)

      expect(await executeContract()).toBe(increment)
    })

    it('provides correctly deployed contracts after calling newChannel function', async () => {
      render(cogitoReact())

      await wait(() => {
        expect(renderFunctionArgs.telepathChannel).toBeDefined()
      })

      const newChannel = renderFunctionArgs.newChannel

      resetRenderPropFunctionArgs()

      newChannel()

      await wait(() => {
        expect(renderFunctionArgs.telepathChannel).toBeDefined()
      })

      mockTelepathChannel(renderFunctionArgs.telepathChannel)

      expect(await executeContract()).toBe(increment)
    })
  })
})
