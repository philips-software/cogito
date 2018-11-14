import React from 'react'
import { render, fireEvent, wait, waitForElement } from 'test-helpers/render-props'
import { CogitoContract } from './CogitoContract'

// import { AppEventsActions } from 'app-events'
import { UserDataActions } from 'user-data'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

jest.mock('@cogitojs/cogito-identity', () => {
  return {
    CogitoIdentity: class {
      static Property = {
        Username: 'username',
        EthereumAddress: 'ethereumAddress'
      }
      constructor ({channel}) {
        this.channel = channel
      }
      getInfo () {
        return this.channel.mockIdentityInfo()
      }
    }
  }
})

jest.mock('components/utils/TimedStatus', () => {
  return {
    TimedStatus: ({children}) => children
  }
})

describe('CogitoContract', () => {
  let channel
  let contracts
  const simpleStorageContractValue = 5
  const channelIdentity1 = {
    ethereumAddress: '0xabcd',
    username: 'Test User'
  }
  const channelIdentity2 = {
    ethereumAddress: '0x1234',
    username: 'Another Test User'
  }

  beforeEach(() => {
    channel = {
      mockIdentityInfo: jest.fn()
        .mockReturnValueOnce(channelIdentity1)
        .mockReturnValueOnce(channelIdentity2),
      createConnectUrl: jest.fn(() => 'https://telepath.connect.url/channel2')
        .mockReturnValueOnce('https://telepath.connect.url/channel1')
    }
    contracts = {
      simpleStorage: {
        read: jest.fn().mockResolvedValueOnce({
          toNumber: jest.fn().mockReturnValueOnce(simpleStorageContractValue)
        }).mockResolvedValueOnce({
          toNumber: jest.fn().mockReturnValueOnce(simpleStorageContractValue + 1)
        })
      }
    }
  })

  afterEach(() => {
    console.error.mockRestore && console.error.mockRestore()
  })

  describe('Initial State', () => {
    it('shows the intial contract value of zero', () => {
      const { getByText, getByTestId } = render(<CogitoContract channel={channel} />)
      expect(getByText(/read/i)).toBeInTheDocument()
      expect(getByTestId(/current-value/i)).toHaveTextContent('0')
    })

    it('has active "Read" button', () => {
      const { getByText } = render(<CogitoContract channel={channel} />)
      const button = getByText(/read/i)
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('has active "Increase" button', () => {
      const { getByText } = render(<CogitoContract channel={channel} />)
      const button = getByText(/increase by 5/i)
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('has active "Show QR code" button', () => {
      const { getByText } = render(<CogitoContract channel={channel} />)
      const button = getByText(/show qr code/i)
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })

    it('does not show the cogito connector', () => {
      const { queryByText } = render(<CogitoContract channel={channel} />)
      expect(queryByText(/scan the qr code/i)).toBeNull()
    })
  })

  describe('reading contract value', () => {
    it('opens the "Scan QR Code" dialog if telepath channel is not yet established', () => {
      const { getByText } = render(<CogitoContract channel={channel} />)
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      expect(getByText(/scan the qr code/i)).toBeInTheDocument()
    })

    it('reads the contract value if telepath channel is already established', async () => {
      expect.assertions(1)
      const { getByText, getByTestId, store: { dispatch } } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      dispatch(UserDataActions.setIdentityInfo({
        ethereumAddress: '0xabcd',
        username: 'Test User'
      }))
      dispatch(UserDataActions.connectionEstablished())
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${simpleStorageContractValue}`))
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
      await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${simpleStorageContractValue}`))
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
      await wait(() => expect(store.getState().userData).toMatchObject(channelIdentity1))
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
      await wait(() => expect(store.getState().userData).toMatchObject(channelIdentity1))
      const showQRCodeButton = getByText(/show qr code/i)
      fireEvent.click(showQRCodeButton)
      fireEvent.click(doneButton)
      fireEvent.click(readButton)
      await wait(() => expect(store.getState().userData).toMatchObject(channelIdentity2))
    })

    it('shows the status when reading the contract value', async () => {
      let readingContractPromiseResolve
      const readingContractPromise = new Promise(resolve => {
        readingContractPromiseResolve = resolve
      })
      contracts = {
        simpleStorage: {
          read: function () {
            return readingContractPromise
          }
        }
      }
      const { getByText, queryByText, store: { dispatch } } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      dispatch(UserDataActions.setIdentityInfo({
        ethereumAddress: '0xabcd',
        username: 'Test User'
      }))
      dispatch(UserDataActions.connectionEstablished())
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      await waitForElement(() => getByText(/executing contract/i))
      readingContractPromiseResolve({
        toNumber: jest.fn().mockReturnValueOnce(simpleStorageContractValue)
      })
      await wait(() => expect(queryByText(/executing contract/i)).toBeNull())
    })

    it('shows an error message when reading contract fails', async () => {
      console.error = jest.fn()
      let readingContractPromiseReject
      const readingContractPromise = new Promise((resolve, reject) => {
        readingContractPromiseReject = reject
      })
      contracts = {
        simpleStorage: {
          read: function () {
            return readingContractPromise
          }
        }
      }
      const { getByText, queryByText, store: { dispatch } } = render(
        <CogitoContract channel={channel} contracts={contracts} />
      )
      dispatch(UserDataActions.setIdentityInfo({
        ethereumAddress: '0xabcd',
        username: 'Test User'
      }))
      dispatch(UserDataActions.connectionEstablished())
      const readButton = getByText(/read/i)
      fireEvent.click(readButton)
      await waitForElement(() => getByText(/executing contract/i))
      const error = new Error('reading contract error')
      readingContractPromiseReject(error)
      await waitForElement(() => getByText('reading contract error'))
      await wait(() => expect(queryByText(/executing contract/i)).toBeNull())
    })
  })
})
