import React from 'react'
import { render, fireEvent, wait, waitForElement } from 'test-helpers/render-props'
import { TelepathChannelMock, SimpleStorageMock, InteractivePromise } from 'test-helpers'
import nock from 'nock'
import { CogitoContract } from './CogitoContract'

import { UserDataActions } from 'user-data'
import { ValueWatcher } from './ValueWatcher'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

jest.mock('components/utils/TimedStatus', () => {
  return {
    TimedStatus: ({ children }) => children
  }
})

describe('CogitoContract', () => {
  let channel
  let contracts

  const setActiveTelepathChannel = dispatch => {
    dispatch(UserDataActions.setIdentityInfo(channel.identities[0]))
    dispatch(UserDataActions.connectionEstablished())
  }

  beforeEach(() => {
    channel = new TelepathChannelMock()
    contracts = {
      simpleStorage: new SimpleStorageMock()
    }
    process.env.FAUCET_URL = 'https://faucet.url/donate'
    nock(process.env.FAUCET_URL).post(`/${channel.identities[0].ethereumAddress}`, '').reply(200)
    nock(process.env.FAUCET_URL).post(`/${channel.identities[1].ethereumAddress}`, '').reply(200)
  })

  describe('when in initial state', () => {
    it('shows the intial contract value of zero', () => {
      const { getByText, getByTestId } = render(<CogitoContract channel={channel} contracts={contracts} />)
      expect(getByText(/current value is/i)).toBeInTheDocument()
      expect(getByTestId(/current-value/i)).toHaveTextContent('0')
    })

    it('has active "Increase" button', () => {
      const { getByText } = render(<CogitoContract channel={channel} contracts={contracts} />)
      const button = getByText(/increase by 5/i)
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('has active "Show QR code" button', () => {
      const { getByText } = render(<CogitoContract channel={channel} contracts={contracts} />)
      const button = getByText(/show qr code/i)
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('does not show the cogito connector', () => {
      const { queryByText } = render(<CogitoContract channel={channel} contracts={contracts} />)
      expect(queryByText(/scan the qr code/i)).toBeNull()
    })
  })

  describe('when increasing contract value', () => {
    const contractValueIncrement = 5

    afterEach(() => {
      console.log.mockRestore && console.log.mockRestore()
    })

    it('shows how to use ValueChanged event mock', async () => {
      const onValueChanged = jest.fn()
      const valueWatcher = new ValueWatcher({
        contracts,
        onValueChanged
      })
      valueWatcher.start()
      contracts.simpleStorage.simulateValueChange(100)
      await wait(() => {
        expect(onValueChanged).toHaveBeenCalledTimes(1)
        expect(onValueChanged.mock.calls[0][0]).toBe(100)
      })
    })
    it('opens the "Scan QR Code" dialog if telepath channel is not yet established', () => {
      const { getByText } = render(<CogitoContract channel={channel} contracts={contracts} />)
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      expect(getByText(/scan the qr code/i)).toBeInTheDocument()
    })

    it('directly increases the contract value if telepath channel is already established', async () => {
      console.log = jest.fn()
      const { getByText, getByTestId, store: { dispatch } } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      // expect(getByTestId(/current-value/i)).toHaveTextContent('0')
      setActiveTelepathChannel(dispatch)
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      contracts.simpleStorage.simulateValueChange(contractValueIncrement)
      await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${contractValueIncrement}`))
    })

    it('shows the "Scan QR Code" dialog and then inceases the contract value after confirming', async () => {
      const { getByText, getByTestId, queryByText } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      contracts.simpleStorage.simulateValueChange(contractValueIncrement)
      await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${contractValueIncrement}`))
      expect(queryByText(/scan the qr code/i)).toBeNull()
    })

    it('sets user identity and connection status in the redux store', async () => {
      const { getByText, store } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => expect(store.getState().userData).toMatchObject(channel.identities[0]))
    })

    it('refetches user idenity if user explicitely requests a new QR Code', async () => {
      const { getByText, store } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => expect(store.getState().userData).toMatchObject(channel.identities[0]))
      const showQRCodeButton = getByText(/show qr code/i)
      fireEvent.click(showQRCodeButton)
      fireEvent.click(doneButton)
      fireEvent.click(increaseButton)
      await wait(() => expect(store.getState().userData).toMatchObject(channel.identities[1]))
    })
  })

  describe('when showing status info', () => {
    let increasePromise
    let renderingContext

    beforeEach(() => {
      increasePromise = new InteractivePromise()
      contracts = {
        simpleStorage: new SimpleStorageMock({ increase: () => increasePromise.get() })
      }
      renderingContext = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const { getByText, store: { dispatch } } = renderingContext
      setActiveTelepathChannel(dispatch)
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
    })

    it('shows the status when increasing the contract value', async () => {
      const { getByText } = renderingContext

      await waitForElement(() => getByText(/executing contract/i))
    })

    it('hides the status when increasing contract value finishes', async () => {
      const { queryByText } = renderingContext

      increasePromise.resolve({
        toNumber: jest.fn().mockReturnValueOnce(SimpleStorageMock.value)
      })
      await wait(() => expect(queryByText(/executing contract/i)).toBeNull())
    })
  })

  describe('handling errors', () => {
    let increasePromise

    beforeEach(() => {
      console.error = jest.fn()
      increasePromise = new InteractivePromise()
      contracts = {
        simpleStorage: new SimpleStorageMock({ increase: () => increasePromise.get() })
      }
    })

    afterEach(() => {
      console.error.mockRestore()
    })

    it('shows an error message when increasing contract value fails', async () => {
      const { getByText, queryByText, store: { dispatch } } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      setActiveTelepathChannel(dispatch)
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      await waitForElement(() => getByText(/executing contract/i))
      const error = new Error('error increasing contract value')
      increasePromise.reject(error)
      await waitForElement(() => getByText(`${error.message}`))
      await wait(() => expect(queryByText(/executing contract/i)).toBeNull())
    })

    it('shows an error message when fetching identity info fails', async () => {
      channel = new TelepathChannelMock({ error: new Error('Error fetching identity info') })
      const { getByText } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await waitForElement(() => getByText(channel.error.message))
    })

    it('shows an error message when fetching identity returns no identity', async () => {
      channel = new TelepathChannelMock({ identities: [] })
      const { getByText } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await waitForElement(() => getByText('No identity found on the mobile device!'))
    })
  })
})
