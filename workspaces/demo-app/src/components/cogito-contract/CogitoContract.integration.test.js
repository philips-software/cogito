import React from 'react'
import { render, fireEvent, wait, waitForElement } from 'test-helpers/render-props'
import {
  TelepathChannelMock,
  GanacheTestNetwork
} from 'test-helpers'
import nock from 'nock'
import { CogitoContract } from './CogitoContract'

import { UserDataActions } from 'user-data'
import { SimpleStorage as simpleStorageDef } from '@cogitojs/demo-app-contracts'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('CogitoContract Integration test', () => {
  let channel
  let simpleStorage
  let simpleStorageProxy
  let from
  let ganacheTestNetwork

  const setActiveTelepathChannel = dispatch => {
    dispatch(UserDataActions.setIdentityInfo(channel.identities[0]))
    dispatch(UserDataActions.connectionEstablished())
  }

  const initSimpleStorageProxy = () => {
    return {
      deployed: jest.fn().mockResolvedValueOnce(simpleStorage)
    }
  }

  beforeEach(async () => {
    ganacheTestNetwork = new GanacheTestNetwork()
    from = (await ganacheTestNetwork.getAccounts())[0]
    const { contract } = await ganacheTestNetwork.deploy(simpleStorageDef, { from })
    simpleStorage = await contract.deployed()
    simpleStorageProxy = initSimpleStorageProxy()
    channel = new TelepathChannelMock({
      identities: [
        {
          ethereumAddress: from,
          username: 'Test User'
        }
      ]
    })
    process.env.FAUCET_URL = 'https://faucet.url/donate'
    nock(process.env.FAUCET_URL).post(`/${from}`, '').reply(200)
  })

  afterEach(() => {
    console.log.mockRestore && console.log.mockRestore()
  })

  it('can increase contract value', async () => {
    console.log = jest.fn()
    const { getByText, getByTestId, store: { dispatch } } = render(
      <CogitoContract channel={channel} simpleStorageProxy={simpleStorageProxy} />
    )
    const currentValue = await waitForElement(() => getByTestId(/current-value/i))
    expect(currentValue).toHaveTextContent('0')
    setActiveTelepathChannel(dispatch)
    const increaseButton = getByText(/increase/i)
    fireEvent.click(increaseButton)
    await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${5}`))
  })
})
