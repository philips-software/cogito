import React from 'react'
import { render, wait } from 'react-testing-library'
import { CogitoReact } from './'
import { Cogito } from '@cogitojs/cogito'

jest.mock('@cogitojs/cogito')

describe('cogito-react', () => {
  const exampleTelepathKey = new Uint8Array([121, 122, 123])
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  // for the actual format of the contractsInfo structure
  // check the integration test or refer to the @cogitojs/cogito package
  const contractsInfo = 'contractsInfo'
  let renderFunction
  let renderFunctionArgs
  let appName = 'App Name'
  let mockUpdate
  let channel
  let cogitoParams
  let onTelepathChanged

  const setupRenderPropFunction = () => {
    renderFunctionArgs = {}
    renderFunction = jest.fn().mockImplementation(args => {
      Object.assign(renderFunctionArgs, args)
      return null
    })
  }

  const setupCogitoMock = () => {
    Cogito.mockReset()
    mockUpdate = jest.fn()

    Cogito.mockImplementation(() => {
      return {
        update: mockUpdate
      }
    })
    mockUpdate.mockResolvedValueOnce(cogitoParams)
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
      web3: 'web3',
      channel,
      contracts: 'contracts'
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
      contracts={contractsInfo}
      onTelepathChanged={onTelepathChanged}>
      {renderFunction}
    </CogitoReact>
  }

  beforeEach(() => {
    setupChannel()
    setExpectedCogitoParams()
    setupRenderPropFunction()
    setupCogitoMock()
  })

  describe('when created without providing channel id and key', function () {
    beforeEach(() => {
      render(cogitoReact({
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
      setupCogitoMock()
      renderFunction.mockClear()
      render(<CogitoReact
        appName={channel.appName}
        contracts={contractsInfo}
        render={renderFunction} />)
      await wait(() => {
        expect(renderFunction).toHaveBeenCalledTimes(2)
      })
    })

    it('returns an instance of web3 to the render prop function', async () => {
      await wait(() => {
        expect(renderFunctionArgs.web3).toBe('web3')
      })
    })

    it('returns an instance of contracts to the render prop function', async () => {
      await wait(() => {
        expect(renderFunctionArgs.contracts).toBe('contracts')
      })
    })

    it('returns an instance of channel to the render prop function', async () => {
      await wait(() => {
        expect(renderFunctionArgs.channel).toEqual(channel)
      })
    })

    it('creates exactly one instance of Cogito from @cogitojs/cogito', async () => {
      expect(Cogito.mock.instances.length).toBe(1)
    })

    it('update from cogito is called exactly once', async () => {
      expect(mockUpdate).toHaveBeenCalledTimes(1)
    })

    it('update from cogito has been called with undefined channelId and channelKey', async () => {
      const updateParams = mockUpdate.mock.calls[0][0]

      expect(updateParams.channelId).toBeUndefined()
      expect(updateParams.channelKey).toBeUndefined()
    })

    it('update from cogito has been called with the provided appName prop value', async () => {
      const updateParams = mockUpdate.mock.calls[0][0]

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
  })

  describe('when created with channel id and key', function () {
    beforeEach(() => {
      render(cogitoReact())
    })

    it('forwards the provided telepath id and key to Cogito from @cogitojs/cogito', () => {
      expect(mockUpdate.mock.calls[0][0]).toMatchObject({
        channelId: channel.id,
        channelKey: channel.key
      })
    })

    it('accepts telepath key prop to be in object format', () => {
      mockUpdate.mockClear()

      updateChannel({
        key: { 0: 124, 1: 125, 2: 126 }
      })

      mockUpdate.mockResolvedValueOnce({
        ...cogitoParams,
        channel
      })

      render(cogitoReact())

      expect(mockUpdate.mock.calls[0][0]).toMatchObject({
        channelId: channel.id,
        channelKey: Uint8Array.from(Object.values(channel.key))
      })
    })
  })

  describe('when channel id, key or app name change', function () {
    let renderingContext

    const rerender = () => {
      const { rerender: rerenderRtl } = renderingContext
      mockUpdate.mockResolvedValueOnce({
        ...cogitoParams,
        channel
      })

      rerenderRtl(cogitoReact())
    }

    beforeEach(() => {
      renderingContext = render(cogitoReact())
    })

    it('calls update on Cogito when channel key changes', () => {
      updateChannel({
        key: new Uint8Array([124, 125, 126])
      })

      rerender()

      expect(mockUpdate.mock.calls[1][0]).toMatchObject({
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

      expect(mockUpdate.mock.calls[1][0]).toMatchObject({
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

      expect(mockUpdate.mock.calls[1][0]).toMatchObject({
        channelId: channel.id,
        channelKey: channel.key,
        appName: channel.appName
      })
    })

    it('updates the channel passed to the render props function when channel key changes', async () => {
      await wait(() => expect(renderFunctionArgs.channel.key).toEqual(channel.key))
      updateChannel({
        key: new Uint8Array([124, 125, 127])
      })

      rerender()

      await wait(() => expect(renderFunctionArgs.channel.key).toEqual(channel.key))
    })

    it('updates the channel passed to the render props function when channel id changes', async () => {
      updateChannel({
        id: 'updated telepath channel id'
      })

      rerender()

      await wait(() => expect(renderFunctionArgs.channel.id).toEqual(channel.id))
    })

    it('updates the channel passed to the render props function when app name changes', async () => {
      updateChannel({
        appName: 'updated app name'
      })

      rerender()

      await wait(() => expect(renderFunctionArgs.channel.appName).toEqual(channel.appName))
    })
  })
})
