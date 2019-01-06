import React from 'react'
import { EthereumForSimpleStorage, TestingRenderProps } from 'test-helpers'
import { render, wait } from 'react-testing-library'
import { CogitoEthereumReact } from './CogitoEthereumReact'

describe('cogito-ethereum-react integration', () => {
  const increment = 10
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  const exampleTelepathKey = new Uint8Array([176, 8, 86, 89, 0, 33, 4, 124, 240, 249, 253, 251, 147, 56, 138, 54, 84, 144, 150, 125, 89, 4, 6, 6, 217, 246, 16, 163, 188, 247, 113, 134])
  let channel
  let renderProps
  let ethereum

  const setupChannel = () => {
    channel = {
      id: exampleTelepathId,
      key: exampleTelepathKey,
      appName: ethereum.appName
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
    return <CogitoEthereumReact
      {...channelProps}
      contractsBlobs={[ethereum.simpleStorageBlob]}>
      {renderProps.function}
    </CogitoEthereumReact>
  }

  const executeContract = async () => {
    let simpleStorage = await ethereum.simpleStorage
    await simpleStorage.increase(increment, { from: ethereum.address })
    const value = await simpleStorage.read()
    return value.toNumber()
  }

  beforeEach(async () => {
    console.log = jest.fn()
    ethereum = await EthereumForSimpleStorage.setup()
    renderProps = new TestingRenderProps()
    setupChannel()
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
      expect(renderProps.args.cogitoWeb3).toBeDefined()
      expect(renderProps.args.contractsProxies.SimpleStorage).toBeDefined()
      expect(renderProps.args.contractsProxies.SimpleStorage.deployed).toEqual(expect.any(Function))
      expect(renderProps.args.telepathChannel.appName).toBe(ethereum.appName)
      expect(renderProps.args.telepathChannel.key).toEqual(expect.any(Uint8Array))
      expect(renderProps.args.telepathChannel.id).toEqual(expect.any(String))
      expect(renderProps.args.newChannel).toEqual(expect.any(Function))
    })
  })

  it('creates channel with supplied channel id and key', async () => {
    render(cogitoReact())

    await wait(() => {
      expect(renderProps.args.telepathChannel).toMatchObject(channel)
    })
  })

  it('supports channel in Array-like object format', async () => {
    render(cogitoReact({
      channelKey: convertToArrayLikeObject(channel.key)
    }))

    await wait(() => {
      expect(renderProps.args.telepathChannel).toMatchObject(channel)
    })
  })

  it('provides contracts correctly deployed with the given provider', async () => {
    render(cogitoReact({
      channelId: undefined,
      channelKey: undefined
    }))

    await wait(() => {
      expect(renderProps.args.telepathChannel).toBeDefined()
    })

    ethereum.useTelepathChannel(renderProps.args.telepathChannel)

    expect(await executeContract()).toBe(increment)
  })

  it('provides correctly deployed contracts when channel changes', async () => {
    const { rerender } = render(cogitoReact({
      channelId: undefined,
      channelKey: undefined
    }))

    await wait(() => {
      expect(renderProps.args.telepathChannel).toBeDefined()
    })

    renderProps.reset()

    rerender(cogitoReact())

    await wait(() => {
      expect(renderProps.args.telepathChannel).toBeDefined()
    })

    ethereum.useTelepathChannel(renderProps.args.telepathChannel)

    expect(await executeContract()).toBe(increment)
  })

  it('provides correctly deployed contracts after calling newChannel function', async () => {
    render(cogitoReact())

    await wait(() => {
      expect(renderProps.args.telepathChannel).toBeDefined()
    })

    const newChannel = renderProps.args.newChannel

    renderProps.reset()

    newChannel()

    await wait(() => {
      expect(renderProps.args.telepathChannel).toBeDefined()
    })

    ethereum.useTelepathChannel(renderProps.args.telepathChannel)

    expect(await executeContract()).toBe(increment)
  })
})
