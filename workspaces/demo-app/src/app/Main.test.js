import { Main } from './Main'
import { inRouter, EthereumForSimpleStorage } from 'test-helpers'
import { render, waitForElement, fireEvent, wait } from 'test-helpers/render-props'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'

import { UserDataActions } from 'user-data'
import { IdentityActions } from 'components/cogito-address/actions'

import { createStore, applyMiddleware } from 'redux'
import { rootReducer } from 'app-state/rootReducer'
import thunkMiddleware from 'redux-thunk'

jest.mock('@cogitojs/demo-app-contracts')
jest.mock('../services/documentation-loader')

jest.unmock('@cogitojs/cogito-react')
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

  const forInitialRendering = getByTestId => {
    return wait(() => {
      expect(getByTestId(/current-address/i)).toHaveTextContent(defaultIdentity.ethereumAddress)
      expect(getByTestId(/current-username/i)).toHaveTextContent(defaultIdentity.username)
    })
  }

  const changeUserIdentity = getByText => {
    setUserIdentity(alternateIdentity)
    const showQRCodeButton = getByText(/show qr code/i)
    fireEvent.click(showQRCodeButton)
    const rerenderedDoneButton = getByText(/done/i)
    fireEvent.click(rerenderedDoneButton)
  }

  const setupStore = () => {
    store = createStore(rootReducer,
      undefined,
      applyMiddleware(thunkMiddleware)
    )
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

  it('renders home page', async () => {
    const { container, getByText } = render(inRouter(Main, '/'))

    await waitForElement(() => getByText('Your Cogito account address is:'))
    expect(container).toMatchSnapshot()
  })

  it('renders contracts page', async () => {
    const { container, getByText } = render(inRouter(Main, '/contracts'))

    await waitForElement(() => getByText('Current value is:'))
    expect(container).toMatchSnapshot()
  })

  it('correctly forwards newChannel prop needed to update identity info', async () => {
    store.dispatch(UserDataActions.setIdentityInfo(defaultIdentity))
    const { getByText, getByTestId } = render(inRouter(Main, '/'), { store })

    await forInitialRendering(getByTestId)

    changeUserIdentity(getByText)

    await wait(() => {
      expect(getByTestId(/current-address/i)).toHaveTextContent(alternateIdentity.ethereumAddress)
      expect(getByTestId(/current-username/i)).toHaveTextContent(alternateIdentity.username)
    })
  })
})
