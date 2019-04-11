import { Main } from './Main'
import { inRouter, EthereumForSimpleStorage } from 'test-helpers'
import {
  render,
  waitForElement,
  fireEvent,
  wait
} from 'test-helpers/render-props'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'

import { UserDataActions } from 'user-data'
import { IdentityActions } from 'components/cogito-address/actions'

import { createStore, applyMiddleware } from 'redux'
import { rootReducer } from 'app-state/rootReducer'
import thunkMiddleware from 'redux-thunk'

jest.mock('@cogitojs/demo-app-contracts')
jest.mock('../services/documentation-loader')

jest.unmock('@cogitojs/cogito-ethereum-react')
jest.unmock('@cogitojs/cogito-identity')
jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('Main', function () {
  let store

  const testAddress = '0xabcd'
  const testUserName = 'Test User'
  const defaultIdentity = {
    ethereumAddress: testAddress,
    username: testUserName
  }
  const alternateIdentity = {
    ethereumAddress: testAddress.toUpperCase(),
    username: testUserName.toUpperCase()
  }

  const mockChannel = (channel, identity) => {
    channel.send = jest.fn().mockImplementation(request => {
      if (request.method === 'getIdentityInfo') {
        return Promise.resolve({
          result: identity
        })
      }
    })
  }

  const setUserIdentity = identity => {
    const read = IdentityActions.read
    IdentityActions.read = ({ channel }) => {
      mockChannel(channel, identity)
      return read({ channel })
    }
  }

  const setupStore = () => {
    store = createStore(
      rootReducer,
      undefined,
      applyMiddleware(thunkMiddleware)
    )
  }

  const showQRCode = async getByText => {
    const showQRCodeButton = await waitForElement(() =>
      getByText(/show qr code/i)
    )
    const {
      channelId: initialId,
      channelKey: initialKey
    } = store.getState().userData
    fireEvent.click(showQRCodeButton)
    return { initialId, initialKey, getByText, store }
  }

  const expectTelepathChanged = (initialId, initialKey, store) => {
    expect(store.getState().userData.channelId).not.toEqual(initialId)
    expect(store.getState().userData.channelKey).not.toEqual(initialKey)
  }

  const validateCorrectPageRendered = async (url, expectedText) => {
    const { container, getByText } = render(inRouter(Main, url))

    await waitForElement(() => getByText(expectedText))
    expect(container).toMatchSnapshot()
  }

  const validateTelepathChanged = async url => {
    const { getByText, store } = render(inRouter(Main, url))
    const { initialId, initialKey } = await showQRCode(getByText)
    await wait(() => {
      expectTelepathChanged(initialId, initialKey, store)
      expect(store.getState().userData.channelKey).not.toEqual(initialKey)
    })
  }

  const validatePageRerendered = async url => {
    const { getByText, store } = render(inRouter(Main, url))
    const { initialId, initialKey } = await showQRCode(getByText)
    await wait(() => {
      expectTelepathChanged(initialId, initialKey, store)
      expect(getByText(/scan the qr code/i)).toBeInTheDocument()
    })
  }

  beforeEach(async () => {
    console.log = jest.fn()
    setupStore()
    const ethereum = await EthereumForSimpleStorage.setup()
    SimpleStorage.mockImplementation(() => {
      return ethereum.deployedJSON
    })
    setUserIdentity(defaultIdentity)
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  describe('when routing to home page', () => {
    const forInitialRendering = getByTestId => {
      return wait(() => {
        expect(getByTestId(/current-address/i)).toHaveTextContent(
          defaultIdentity.ethereumAddress
        )
        expect(getByTestId(/current-username/i)).toHaveTextContent(
          defaultIdentity.username
        )
      })
    }

    it('renders correct page', async () => {
      await validateCorrectPageRendered('/', 'Your Cogito account address is:')
    })

    it('creates new telepath channel when user explicitly requests QR code', async () => {
      await validateTelepathChanged('/')
    })

    it('keeps dialog open after the channel has changed and page rerendered', async () => {
      await validatePageRerendered('/')
    })
  })

  describe('when routing to contracts page', () => {
    it('renders correct page', async () => {
      await validateCorrectPageRendered('/contracts', 'Current value is:')
    })

    it('creates new telepath channel when user explicitly requests QR code', async () => {
      await validateTelepathChanged('/contracts')
    })

    it('keeps dialog open after the channel has changed and page rerendered', async () => {
      await validatePageRerendered('/contracts')
    })

    it('rerenders the page when channel changes', async () => {
      const { getByText, queryByText, store } = render(
        inRouter(Main, '/contracts')
      )
      const showQRCodeButton = await waitForElement(() =>
        getByText(/show qr code/i)
      )
      const {
        channelId: initialId,
        channelKey: initialKey
      } = store.getState().userData
      fireEvent.click(showQRCodeButton)
      // By waiting for channel to change we can request the button *AFTER* the page
      // has been rerendered. If we do not do that, we will get the reference
      // to a wrong button, which will close the dialog by changing the redux state
      // (AppEventsActions.setDialogClosed()), but react will warn that
      // we try to update state on an unmounted component.
      await wait(() => {
        expect(store.getState().userData.channelId).not.toEqual(initialId)
        expect(store.getState().userData.channelKey).not.toEqual(initialKey)
      })
      const doneButton = getByText(/done/i)
      fireEvent.click(doneButton)
      expect(queryByText(/scan the qr code/i)).toBeNull()
    })
  })
})
