import React from 'react'
import { InteractivePromise } from 'test-helpers'
import { render, wait, waitForElement, fireEvent } from 'test-helpers/render-props'
import { Telepath } from '@cogitojs/telepath-js'
import { CogitoAddress } from './CogitoAddress'
import { UserDataActions } from 'user-data'
import { AppEventsActions } from 'app-events'

jest.unmock('@cogitojs/cogito-identity')
jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('CogitoAddress', () => {
  const testAddress = '0xabcd'
  const testUserName = 'Test User'
  const appName = 'Cogito Demo App'
  const defaultIdentity = {
    ethereumAddress: testAddress,
    username: testUserName
  }
  const alternateIdentity = {
    ethereumAddress: testAddress.toUpperCase(),
    username: testUserName.toUpperCase()
  }
  let telepath
  let telepathChannel

  const setActiveTelepathChannel = dispatch => {
    dispatch(UserDataActions.setIdentityInfo(defaultIdentity))
    dispatch(UserDataActions.connectionEstablished())
  }

  const setUserIdentity = (identity = defaultIdentity) => {
    telepathChannel.send = jest.fn().mockImplementation(request => {
      if (request.method === 'getIdentityInfo') {
        return Promise.resolve({
          result: identity
        })
      }
    })
  }

  const newChannel = async () => {
    telepathChannel = await telepath.createChannel({ appName })
    return telepathChannel
  }

  const cogitoAddress = () => (
    <CogitoAddress telepathChannel={telepathChannel} newChannel={newChannel} />
  )

  beforeEach(async () => {
    telepath = new Telepath('https://telepath.cogito.mobi')
    telepathChannel = await newChannel()
  })

  describe('when in initial state', async () => {
    it('shows current cogito account address', async () => {
      const { getByText, getByTestId } = render(cogitoAddress())
      await waitForElement(() => getByText(/your cogito account address is:/i))
      expect(getByTestId(/current-address/i)).toHaveTextContent('unknown')
    })

    it('shows current cogito username', async () => {
      const { getByText, getByTestId } = render(cogitoAddress())
      await waitForElement(() => getByText(/you are known as:/i))
      expect(getByTestId(/current-username/i)).toHaveTextContent('unknown')
    })

    it('has active "Read your identity..." button', async () => {
      const { getByText } = render(cogitoAddress())
      const button = await waitForElement(() => getByText(/read your identity.../i))
      expect(button).not.toBeDisabled()
    })

    it('has active "Show QR code" button', async () => {
      const { getByText } = render(cogitoAddress())
      const button = await waitForElement(() => getByText(/show qr code/i))
      expect(button).not.toBeDisabled()
    })

    it('does not show the cogito connector', async () => {
      const { getByText, queryByText } = render(cogitoAddress())
      await waitForElement(() => getByText(/read your identity.../i))
      expect(queryByText(/scan the qr code/i)).toBeNull()
    })
  })

  describe('when reading user identity', () => {
    beforeEach(() => {
      setUserIdentity()
    })

    it('opens the "Scan QR Code" dialog if telepath channel is not yet established', async () => {
      const { getByText } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      fireEvent.click(readButton)
      expect(getByText(/scan the qr code/i)).toBeInTheDocument()
    })

    it('immediatelly fetches user identity if telepath channel is already established', async () => {
      const { getByText, getByTestId, store: { dispatch } } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      setActiveTelepathChannel(dispatch)
      fireEvent.click(readButton)
      await wait(() => {
        expect(getByTestId(/current-address/i)).toHaveTextContent(testAddress)
        expect(getByTestId(/current-username/i)).toHaveTextContent(testUserName)
      })
    })

    it('shows the "Scan QR Code" dialog and then reads identity after confirming', async () => {
      const { getByText, getByTestId, queryByText } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      fireEvent.click(readButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => {
        expect(getByTestId(/current-address/i)).toHaveTextContent(testAddress)
        expect(getByTestId(/current-username/i)).toHaveTextContent(testUserName)
      })
      expect(queryByText(/scan the qr code/i)).toBeNull()
    })

    it('sets user identity and connection status in the redux store', async () => {
      const { getByText, store } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      fireEvent.click(readButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => expect(store.getState().userData).toMatchObject(defaultIdentity))
    })

    it('creates a new telepath channel if user explicitely requests a new QR Code', async () => {
      const { getByText, store } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      fireEvent.click(readButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => expect(store.getState().userData).toMatchObject(defaultIdentity))
      setUserIdentity(alternateIdentity)
      const showQRCodeButton = getByText(/show qr code/i)
      fireEvent.click(showQRCodeButton)
      const rerenderedDoneButton = getByText(/done/i)
      fireEvent.click(rerenderedDoneButton)
      await wait(() => expect(store.getState().userData).toMatchObject(alternateIdentity))
    })

    it('displays new identity if user explicitely requests a new QR Code', async () => {
      const { getByText, getByTestId } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      fireEvent.click(readButton)
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      await wait(() => {
        expect(getByTestId(/current-address/i)).toHaveTextContent(defaultIdentity.ethereumAddress)
        expect(getByTestId(/current-username/i)).toHaveTextContent(defaultIdentity.username)
      })
      setUserIdentity(alternateIdentity)
      const showQRCodeButton = getByText(/show qr code/i)
      fireEvent.click(showQRCodeButton)
      const rerenderedDoneButton = getByText(/done/i)
      fireEvent.click(rerenderedDoneButton)
      await wait(() => {
        expect(getByTestId(/current-address/i)).toHaveTextContent(alternateIdentity.ethereumAddress)
        expect(getByTestId(/current-username/i)).toHaveTextContent(alternateIdentity.username)
      })
    })
  })

  describe('when showing status info', () => {
    let identityPromise
    let renderingContext

    beforeEach(async () => {
      identityPromise = new InteractivePromise()
      renderingContext = render(cogitoAddress())
      const { getByText, store: { dispatch } } = renderingContext
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      telepathChannel.send = () => identityPromise.get()
      setActiveTelepathChannel(dispatch)
      fireEvent.click(readButton)
    })

    it('shows the status when increasing the contract value', async () => {
      const { getByText } = renderingContext

      await waitForElement(() => getByText(/reading identity/i))
    })

    it('hides the status when increasing contract value finishes', async () => {
      const { queryByText } = renderingContext

      identityPromise.resolve({ result: defaultIdentity })
      await wait(() => expect(queryByText(/reading identity/i)).toBeNull())
    })
  })

  describe('handling errors', () => {
    let identityPromise

    beforeEach(() => {
      console.error = jest.fn()
      identityPromise = new InteractivePromise()
      telepathChannel.send = () => identityPromise.get()
    })

    afterEach(() => {
      console.error.mockRestore()
    })

    it('shows an error message when reading identity fails', async () => {
      const { getByText, queryByText, store: { dispatch } } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      setActiveTelepathChannel(dispatch)
      fireEvent.click(readButton)
      await waitForElement(() => getByText(/reading identity/i))
      const error = new Error('error retrieving identity')
      identityPromise.reject(error)
      await wait(() => {
        expect(queryByText(/reading identity/i)).toBeNull()
        expect(getByText(`${error.message}`)).toBeInTheDocument()
      })
    })

    it('shows an error message when telepath returns an error response', async () => {
      const { getByText, queryByText, store: { dispatch } } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      setActiveTelepathChannel(dispatch)
      fireEvent.click(readButton)
      await waitForElement(() => getByText(/reading identity/i))
      const error = new Error('telepath channel response error')
      identityPromise.resolve({ error })
      await wait(() => {
        expect(queryByText(/reading identity/i)).toBeNull()
        expect(getByText(`${error.message}`)).toBeInTheDocument()
      })
    })

    it('shows an error message when telepath returns an empty response', async () => {
      const error = new Error('No identity found on the mobile device!')
      const { getByText, queryByText, store: { dispatch } } = render(cogitoAddress())
      const readButton = await waitForElement(() => getByText(/read your identity.../i))
      setActiveTelepathChannel(dispatch)
      fireEvent.click(readButton)
      await waitForElement(() => getByText(/reading identity/i))
      identityPromise.resolve({})
      await wait(() => {
        expect(queryByText(/reading identity/i)).toBeNull()
        expect(getByText(`${error.message}`)).toBeInTheDocument()
      })
    })

    it('hides the error message after sometime', async () => {
      jest.useFakeTimers()
      const reason = 'there is a special reason'
      const { getByText, queryByText, store } = render(cogitoAddress())
      store.dispatch(AppEventsActions.telepathError({ reason }))
      await waitForElement(() => getByText(reason))
      Promise.resolve().then(() => jest.advanceTimersByTime(3000))
      await wait(() => {
        expect(queryByText(reason)).toBeNull()
        expect(store.getState().appEvents.telepathError).toBeUndefined()
      })
    })
  })
})
