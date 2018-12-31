import React from 'react'
import { ethers } from 'ethers'
import { EthereumForSimpleStorage } from 'test-helpers'
import { render, wait } from 'react-testing-library'
import { CogitoReact } from './CogitoReact'

describe('cogito-react integration', () => {
  const increment = 10
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  const exampleTelepathKey = new Uint8Array([176, 8, 86, 89, 0, 33, 4, 124, 240, 249, 253, 251, 147, 56, 138, 54, 84, 144, 150, 125, 89, 4, 6, 6, 217, 246, 16, 163, 188, 247, 113, 134])
  const appName = 'Cogito Demo App'
  let channel
  let renderFunction
  let renderFunctionArgs
  let ethereum

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
      contractsBlobs={[ethereum.simpleStorageBlob]}>
      {renderFunction}
    </CogitoReact>
  }

  const setupEthereum = async () => {
    ethereum = new EthereumForSimpleStorage({ appName })
    await ethereum.setup()
  } 

  const executeContract = async () => {
    let simpleStorage = await ethereum.simpleStorage
    await simpleStorage.increase(increment, { from: ethereum.address })
    const value = await simpleStorage.read()
    return value.toNumber()
  }

  beforeEach(async () => {
    console.log = jest.fn()
    await setupEthereum()
    setupChannel()
    setupRenderPropFunction()
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

  it('provides contracts correctly deployed with the given provider', async () => {
    render(cogitoReact({
      channelId: undefined,
      channelKey: undefined
    }))

    await wait(() => {
      expect(renderFunctionArgs.telepathChannel).toBeDefined()
    })

    ethereum.useTelepathChannel(renderFunctionArgs.telepathChannel)

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

    ethereum.useTelepathChannel(renderFunctionArgs.telepathChannel)

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

    ethereum.useTelepathChannel(renderFunctionArgs.telepathChannel)

    expect(await executeContract()).toBe(increment)
  })
})
