import React from 'react'
import { render, wait } from 'react-testing-library'
import { CogitoReact } from './'
import { CogitoEthereum } from '@cogitojs/cogito'

jest.mock('@cogitojs/cogito')

describe('cogito-react', () => {
  const exampleTelepathKey = new Uint8Array([121, 122, 123])
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  // for the actual format of the blobs structure
  // check the integration test or refer to the @cogitojs/cogito package
  const blobs = 'blobs'
  let renderFunction
  let renderFunctionArgs
  let appName = 'App Name'
  let mockGetContext
  let channel
  let cogitoParams
  let onTelepathChanged
  let renderingContext

  const setupRenderPropFunction = () => {
    renderFunctionArgs = {}
    renderFunction = jest.fn().mockImplementation(args => {
      Object.assign(renderFunctionArgs, args)
      return null
    })
  }

  const setupCogitoEthereumMock = () => {
    CogitoEthereum.mockReset()
    mockGetContext = jest.fn()

    CogitoEthereum.mockImplementation(() => {
      return {
        getContext: mockGetContext
      }
    })
    mockGetContext.mockResolvedValueOnce(cogitoParams)
  }

  const setupChannel = () => {
    channel = {
      id: exampleTelepathId,
      key: exampleTelepathKey,
      appName
    }
  }

  const updateChannel = change => {
    channel = {
      ...channel,
      ...change
    }
  }

  const setExpectedCogitoParams = () => {
    cogitoParams = {
      cogitoWeb3: 'cogitoWeb3',
      telepathChannel: channel,
      contractsProxies: 'contractsProxies'
    }
  }

  const cogitoReact = (channelUpdates = {}) => {
    onTelepathChanged = jest.fn()
    let channelProps = {
      channelId: channel.id,
      channelKey: channel.key,
      appName: channel.appName,
      ...channelUpdates
    }
    return <CogitoReact
      {...channelProps}
      contractsBlobs={blobs}
      onTelepathChanged={onTelepathChanged}>
      {renderFunction}
    </CogitoReact>
  }

  const rerender = () => {
    const { rerender: rerenderRtl } = renderingContext
    mockGetContext.mockResolvedValueOnce({
      ...cogitoParams,
      telepathChannel: channel
    })

    rerenderRtl(cogitoReact())
  }

  beforeEach(() => {
    setupChannel()
    setExpectedCogitoParams()
    setupRenderPropFunction()
    setupCogitoEthereumMock()
  })

  describe('when created without providing channel id and key', function () {
    beforeEach(() => {
      renderingContext = render(cogitoReact({
        channelId: undefined,
        channelKey: undefined
      }))
    })

    it('accepts render props function as a child', async () => {
      await wait(() => {
        expect(renderFunction).toHaveBeenCalledTimes(2)
      })
    })

    it('accepts render props function as a prop', async () => {
      setupCogitoEthereumMock()
      renderFunction.mockClear()
      render(<CogitoReact
        appName={channel.appName}
        blobs={blobs}
        render={renderFunction} />)
      await wait(() => {
        expect(renderFunction).toHaveBeenCalledTimes(2)
      })
    })

    it('returns an instance of web3 to the render prop function', async () => {
      await wait(() => {
        expect(renderFunctionArgs.cogitoWeb3).toBe('cogitoWeb3')
      })
    })

    it('returns an instance of contracts to the render prop function', async () => {
      await wait(() => {
        expect(renderFunctionArgs.contractsProxies).toBe('contractsProxies')
      })
    })

    it('returns an instance of channel to the render prop function', async () => {
      await wait(() => {
        expect(renderFunctionArgs.telepathChannel).toEqual(channel)
      })
    })

    it('provides a function that allows creating a new channel', async () => {
      await wait(() => {
        expect(renderFunctionArgs.newChannel).toEqual(expect.any(Function))
      })
    })

    it('creates exactly one instance of Cogito from @cogitojs/cogito', async () => {
      expect(CogitoEthereum.mock.instances.length).toBe(1)
    })

    it('update from cogito is called exactly once', async () => {
      expect(mockGetContext).toHaveBeenCalledTimes(1)
    })

    it('update from cogito has been called with undefined channelId and channelKey', async () => {
      const updateParams = mockGetContext.mock.calls[0][0]

      expect(updateParams.channelId).toBeUndefined()
      expect(updateParams.channelKey).toBeUndefined()
    })

    it('update from cogito has been called with the provided appName prop value', async () => {
      const updateParams = mockGetContext.mock.calls[0][0]

      expect(updateParams.appName).toBe(appName)
    })

    it('calls provided onTelepathChanged method after channel has been created', async () => {
      await wait(() => expect(onTelepathChanged).toHaveBeenCalledTimes(1))
    })

    it('provides channelId, channelKey and appName to the onTelepathChanged callback when called', async () => {
      await wait(() => {
        expect(onTelepathChanged.mock.calls[0][0]).toMatchObject({
          channelId: channel.id,
          channelKey: channel.key,
          appName
        })
      })
    })

    it('does not unnecessarily re-renders when the new prop value is the same as the recorded state', async () => {
      rerender()

      expect(mockGetContext).toHaveBeenCalledTimes(1)
    })
  })

  describe('when created with channel id and key', function () {
    beforeEach(() => {
      render(cogitoReact())
    })

    it('forwards the provided telepath id and key to Cogito from @cogitojs/cogito', () => {
      expect(mockGetContext.mock.calls[0][0]).toMatchObject({
        channelId: channel.id,
        channelKey: channel.key
      })
    })

    it('accepts telepath key prop to be in object format', () => {
      mockGetContext.mockClear()

      updateChannel({
        key: { 0: 124, 1: 125, 2: 126 }
      })

      mockGetContext.mockResolvedValueOnce({
        ...cogitoParams,
        telepathChannel: channel
      })

      render(cogitoReact())

      expect(mockGetContext.mock.calls[0][0]).toMatchObject({
        channelId: channel.id,
        channelKey: Uint8Array.from(Object.values(channel.key))
      })
    })
  })

  describe('when channel id, key or app name change', function () {
    const convertToArrayLikeObject = uint8Array => {
      return uint8Array.reduce((acc, current, index) => { return { ...acc, [index]: current } }, {})
    }

    beforeEach(() => {
      renderingContext = render(cogitoReact())
    })

    it('calls update on Cogito when channel key changes', () => {
      updateChannel({
        key: new Uint8Array([124, 125, 126])
      })

      rerender()

      expect(mockGetContext.mock.calls[1][0]).toMatchObject({
        channelId: channel.id,
        channelKey: channel.key,
        appName
      })
    })

    it('calls update on Cogito when channel id changes', () => {
      updateChannel({
        id: 'updated telepath channel id'
      })

      rerender()

      expect(mockGetContext.mock.calls[1][0]).toMatchObject({
        channelId: channel.id,
        channelKey: channel.key,
        appName
      })
    })

    it('calls update on Cogito when app name changes', () => {
      updateChannel({
        appName: 'updated app name'
      })

      rerender()

      expect(mockGetContext.mock.calls[1][0]).toMatchObject({
        channelId: channel.id,
        channelKey: channel.key,
        appName: channel.appName
      })
    })

    it('updates the channel passed to the render props function when channel key changes', async () => {
      await wait(() => expect(renderFunctionArgs.telepathChannel.key).toEqual(channel.key))
      updateChannel({
        key: new Uint8Array([124, 125, 127])
      })

      rerender()

      await wait(() => expect(renderFunctionArgs.telepathChannel.key).toEqual(channel.key))
    })

    it('updates the channel passed to the render props function when channel id changes', async () => {
      updateChannel({
        id: 'updated telepath channel id'
      })

      rerender()

      await wait(() => expect(renderFunctionArgs.telepathChannel.id).toEqual(channel.id))
    })

    it('updates the channel passed to the render props function when app name changes', async () => {
      updateChannel({
        appName: 'updated app name'
      })

      rerender()

      await wait(() => expect(renderFunctionArgs.telepathChannel.appName).toEqual(channel.appName))
    })

    it('does not unnecessarily re-renders when the only change is the key prop format', async () => {
      updateChannel({
        key: convertToArrayLikeObject(exampleTelepathKey)
      })

      rerender()

      expect(mockGetContext).toHaveBeenCalledTimes(1)
    })
  })

  describe('when calling the provided newChannel function', () => {
    beforeEach(() => {
      renderingContext = render(cogitoReact())
      updateChannel({
        id: 'updated telepath channel id',
        key: new Uint8Array([124, 125, 126])
      })
      mockGetContext.mockResolvedValueOnce({
        ...cogitoParams,
        telepathChannel: channel
      })
      renderFunctionArgs.newChannel()
    })

    it('calls update from @cogitojs/cogito with undefined id and key', async () => {
      const updateParams = mockGetContext.mock.calls[1][0]

      await wait(() => {
        expect(updateParams.channelId).toBeUndefined()
        expect(updateParams.channelKey).toBeUndefined()
      })
    })

    it('it holds the same appName', async () => {
      const updateParams = mockGetContext.mock.calls[1][0]

      await wait(() => {
        expect(updateParams.appName).toBe(appName)
      })
    })

    it('calls provided onTelepathChanged again', async () => {
      await wait(() => expect(onTelepathChanged).toHaveBeenCalledTimes(2))
    })

    it('provides new channelId, channelKey and appName to the onTelepathChanged callback', async () => {
      await wait(() => {
        expect(onTelepathChanged.mock.calls[1][0]).toMatchObject({
          channelId: channel.id,
          channelKey: channel.key,
          appName
        })
      })
    })

    it('provides new channelId and channelKey to the render prop function', async () => {
      await wait(() => {
        expect(renderFunctionArgs.telepathChannel).toMatchObject({
          id: channel.id,
          key: channel.key
        })
      })
    })

    it('provides unchanged appName to the render prop function', async () => {
      await wait(() => {
        expect(renderFunctionArgs.telepathChannel.appName).toBe(appName)
      })
    })

    it('does not unecessariy re-renders when props change to the current state', async () => {
      rerender()

      expect(mockGetContext).toHaveBeenCalledTimes(2)
    })
  })

  describe('when provided props are not well-formed', () => {
    const badKeysError = badKeys => {
      return `Warning: Failed prop type: Invalid prop channelKey.
Expects:  instance of Uint8Array or an Array-like object
Received: an object with non-numerical keys: ${badKeys}
    in CogitoReact`
    }

    const badValuesError = badValues => {
      return `Warning: Failed prop type: Invalid prop channelKey.
Expects:  instance of Uint8Array or an Array-like object with numerical entries
Received: an Array-like object with non-numerical values: ${badValues}
    in CogitoReact`
    }

    const unexpected = prop => {
      return `Warning: Failed prop type: Invalid prop channelKey.
Expects:  instance of Uint8Array or an Array-like object with numerical entries
Received: ${typeof prop}
    in CogitoReact`
    }

    const badIdError = prop => {
      return 'Warning: Failed prop type: Invalid prop `channelId` ' +
             'of type `' + `${typeof prop}` + '` supplied to `CogitoReact`, expected `string`.\n' +
             `    in CogitoReact`
    }

    beforeEach(() => {
      console.error = jest.fn()
    })

    afterEach(() => {
      console.error.mockRestore()
    })

    it('does not issue a warning when channel key is undefined', () => {
      render(cogitoReact({
        channelId: channel.id,
        channelKey: undefined
      }))
      expect(console.error).not.toHaveBeenCalled()
    })

    it('does not issue a warning when channel key and channel id are well-formed', () => {
      render(cogitoReact({
        channelId: channel.id,
        channelKey: channel.key
      }))
      expect(console.error).not.toHaveBeenCalled()
    })

    it('does not issue a warning when channel id is undefined', () => {
      render(cogitoReact({
        channelId: undefined,
        channelKey: channel.key
      }))
      expect(console.error).not.toHaveBeenCalled()
    })

    it('issues warning when channel key is not correctly formatted', () => {
      render(cogitoReact({
        channelId: channel.id,
        channelKey: { a: 1, 1: 2, 2: 3 }
      }))
      expect(console.error).toHaveBeenCalledWith(badKeysError('a'))
    })

    it('issues warning when channel key is not correctly formatted', () => {
      render(cogitoReact({
        channelId: channel.id,
        channelKey: { 0: 1, 1: '2', 2: 3 }
      }))
      expect(console.error).toHaveBeenCalledWith(badValuesError('2'))
    })

    it('issues warning when channel key is not correctly formatted', () => {
      render(cogitoReact({
        channelId: channel.id,
        channelKey: 'string value'
      }))
      expect(console.error).toHaveBeenCalledWith(unexpected('string'))
    })

    it('issues warning when channel id is not correctly formatted', () => {
      render(cogitoReact({
        channelId: 2,
        channelKey: channel.key
      }))
      expect(console.error).toHaveBeenCalledWith(badIdError(2))
    })
  })
})
