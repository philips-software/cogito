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
    TimedStatus: ({children}) => children
  }
})

describe('CogitoContract', () => {
  let channel
  let contracts

  beforeEach(() => {
    channel = new TelepathChannelMock()
    contracts = {
      simpleStorage: new SimpleStorageMock()
    }
  })

  describe('Initial State', () => {
    it('shows the intial contract value of zero', () => {
      const { getByText, getByTestId } = render(<CogitoContract channel={channel} contracts={contracts} />)
      expect(getByText(/read/i)).toBeInTheDocument()
      expect(getByTestId(/current-value/i)).toHaveTextContent('0')
    })

    it('has active "Read" button', () => {
      const { getByText } = render(<CogitoContract channel={channel} contracts={contracts} />)
      const button = getByText(/read/i)
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
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

  describe('reading contract value', () => {
    const setActiveTelepathChannel = dispatch => {
      dispatch(UserDataActions.setIdentityInfo(channel.identities[0]))
      dispatch(UserDataActions.connectionEstablished())
    }

    it('opens the "Scan QR Code" dialog if telepath channel is not yet established', () => {
      const { getByText } = render(<CogitoContract channel={channel} contracts={contracts} />)
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      expect(getByText(/scan the qr code/i)).toBeInTheDocument()
    })

    it('reads the contract value if telepath channel is already established', async () => {
      expect.assertions(1)
      const { getByText, getByTestId, store: { dispatch } } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      setActiveTelepathChannel(dispatch)
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${SimpleStorageMock.value}`))
    })

    it('shows the "Scan QR Code" dialog and then reads the contract value after confirming', async () => {
      expect.assertions(2)
      const { getByText, getByTestId, queryByText } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${SimpleStorageMock.value}`))
      expect(queryByText(/scan the qr code/i)).toBeNull()
    })

    it('sets user identity and connection status in the redux store', async () => {
      expect.assertions(1)
      const { getByText, store } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => expect(store.getState().userData).toMatchObject(channel.identities[0]))
    })

    it('refetches user idenity if user explicitely requests a new QR Code', async () => {
      expect.assertions(2)
      const { getByText, store } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => expect(store.getState().userData).toMatchObject(channel.identities[0]))
      const showQRCodeButton = getByText(/show qr code/i)
      fireEvent.click(showQRCodeButton)
      fireEvent.click(doneButton)
      fireEvent.click(readButton)
      await wait(() => expect(store.getState().userData).toMatchObject(channel.identities[1]))
    })

    describe('showing status info', () => {
      let interactivePromise

      beforeEach(() => {
        interactivePromise = new InteractivePromise()
        contracts = {
          simpleStorage: new SimpleStorageMock({ read: () => interactivePromise.get() })
        }
      })

      it('shows the status when reading the contract value', async () => {
        expect.assertions(1)
        const { getByText, queryByText, store: { dispatch } } = render(
          <CogitoContract channel={channel} contracts={contracts} />
        )
        setActiveTelepathChannel(dispatch)
        const readButton = getByText(/read/i)
        fireEvent.click(readButton)
        await waitForElement(() => getByText(/executing contract/i))
        interactivePromise.resolve({
          toNumber: jest.fn().mockReturnValueOnce(SimpleStorageMock.value)
        })
        await wait(() => expect(queryByText(/executing contract/i)).toBeNull())
      })
    })

    describe('handling errors', () => {
      let interactivePromise

      beforeEach(() => {
        console.error = jest.fn()
        interactivePromise = new InteractivePromise()
        contracts = {
          simpleStorage: new SimpleStorageMock({ read: () => interactivePromise.get() })
        }
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      it('shows an error message when reading contract fails', async () => {
        expect.assertions(1)
        const { getByText, queryByText, store: { dispatch } } = render(
          <CogitoContract channel={channel} contracts={contracts} />
        )
        setActiveTelepathChannel(dispatch)
        const readButton = getByText(/read/i)
        fireEvent.click(readButton)
        await waitForElement(() => getByText(/executing contract/i))
        const error = new Error('reading contract error')
        interactivePromise.reject(error)
        await waitForElement(() => getByText('reading contract error'))
        await wait(() => expect(queryByText(/executing contract/i)).toBeNull())
      })

      it('shows an error message when fetching identity info fails', async () => {
        channel = new TelepathChannelMock({ error: new Error('Error fetching identity info') })
        // channel.error = new Error('Error fetching identity info')
        const { getByText } = render(
          <CogitoContract channel={channel} contracts={contracts} />
        )
        const readButton = getByText(/read/i)
        fireEvent.click(readButton)
        const doneButton = getByText(/done/i)
        fireEvent.click(doneButton)
        await waitForElement(() => getByText(channel.error.message))
      })

      it('shows an error message when fetching identity returns no identity', async () => {
        channel = new TelepathChannelMock({ identities: [] })
        const { getByText } = render(
          <CogitoContract channel={channel} contracts={contracts} />
        )
        const readButton = getByText(/read/i)
        fireEvent.click(readButton)
        const doneButton = getByText(/done/i)
        fireEvent.click(doneButton)
        await waitForElement(() => getByText('No identity found on the mobile device!'))
      })
    })
  })

  describe('increasing contract value', () => {
    const setActiveTelepathChannel = dispatch => {
      dispatch(UserDataActions.setIdentityInfo(channel.identities[0]))
      dispatch(UserDataActions.connectionEstablished())
    }
    beforeEach(() => {
      process.env.FAUCET_URL = 'https://faucet.url/donate'
      nock(process.env.FAUCET_URL).post('/0xabcd', '').reply(200)
    })

    afterEach(() => {
      console.log.mockRestore && console.log.mockRestore()
    })

    it('opens the "Scan QR Code" dialog if telepath channel is not yet established', () => {
      const { getByText } = render(<CogitoContract channel={channel} contracts={contracts} />)
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      expect(getByText(/scan the qr code/i)).toBeInTheDocument()
    })

    it('increases the contract value if telepath channel is already established', async () => {
      expect.assertions(2)
      console.log = jest.fn()
      const { getByText, getByTestId, store: { dispatch } } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      expect(getByTestId(/current-value/i)).toHaveTextContent('0')
      setActiveTelepathChannel(dispatch)
      const increaseButton = getByText(/increase/i)
      fireEvent.click(increaseButton)
      contracts.simpleStorage.simulateValueChange(100)
      await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${100}`))
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
  })
})
