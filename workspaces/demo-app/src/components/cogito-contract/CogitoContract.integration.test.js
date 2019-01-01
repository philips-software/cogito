import React from 'react'
import { render, fireEvent, wait, waitForElement } from 'test-helpers/render-props'
import { EthereumForSimpleStorage } from 'test-helpers'
import nock from 'nock'
import { CogitoContract } from './CogitoContract'

import { UserDataActions } from 'user-data'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('CogitoContract Integration test', () => {
  let ethereum

  const setActiveTelepathChannel = dispatch => {
    dispatch(UserDataActions.setIdentityInfo({
      ethereumAddress: ethereum.address,
      username: 'Test User'
    }))
    dispatch(UserDataActions.connectionEstablished())
  }

  const mockNetwork = () => {
    process.env.REACT_APP_FAUCET_URL = 'https://faucet.url/donate'
    nock(process.env.REACT_APP_FAUCET_URL).post(`/${ethereum.address}`, '').reply(200)
  }

  beforeEach(async () => {
    console.log = jest.fn()

    ethereum = await EthereumForSimpleStorage.setup()

    mockNetwork()
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  it('can increase contract value', async () => {
    const { getByText, getByTestId, store: { dispatch } } = render(
      <CogitoContract channel={ethereum.telepathChannel} simpleStorageProxy={ethereum.simpleStorageProxy} />
    )
    const currentValue = await waitForElement(() => getByTestId(/current-value/i))
    expect(currentValue).toHaveTextContent('0')
    setActiveTelepathChannel(dispatch)
    const increaseButton = getByText(/increase/i)
    fireEvent.click(increaseButton)
    await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${5}`))
  })
})
