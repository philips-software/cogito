import React from 'react'
import { ethers } from 'ethers'
import { render, fireEvent, wait, waitForElement } from 'test-helpers/render-props'
import { GanacheTestNetwork } from 'test-helpers'
import nock from 'nock'
import { CogitoContract } from './CogitoContract'

import { UserDataActions } from 'user-data'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'
import { CogitoEthereum } from '@cogitojs/cogito'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('CogitoContract Integration test', () => {
  const appName = 'Cogito Demo App'
  let cogitoEthereum
  let cogitoContext
  let ganacheTestNetwork
  const mnemonic = 'hair snack volcano shift tragic wrong wreck release vibrant gossip ugly debate'
  let wallet

  const setActiveTelepathChannel = dispatch => {
    dispatch(UserDataActions.setIdentityInfo({
      ethereumAddress: wallet.address,
      username: 'Test User'
    }))
    dispatch(UserDataActions.connectionEstablished())
  }

  const makeTransactionEthersCompatible = transaction => {
    let ethersTransaction = {
      ...transaction,
      gasLimit: transaction.gas
    }
    delete ethersTransaction.from
    delete ethersTransaction.gas
    return ethersTransaction
  }

  const mockTelepathChannel = telepathChannel => {
    telepathChannel.send = jest.fn().mockImplementationOnce(async signRequest => {
      const transaction = makeTransactionEthersCompatible(signRequest.params[0])
      const signedTransaction = await wallet.sign(transaction)
      return Promise.resolve({
        result: signedTransaction
      })
    })
  }

  beforeEach(async () => {
    wallet = ethers.Wallet.fromMnemonic(mnemonic)
    ganacheTestNetwork = new GanacheTestNetwork()
    window.web3 = ganacheTestNetwork.web3
    process.env.REACT_APP_USE_INJECTED_WEB3 = 'YES'
    console.log = jest.fn()

    const { deployedJSON } = await ganacheTestNetwork.deploy(SimpleStorage, { from: wallet.address })
    cogitoEthereum = new CogitoEthereum([ deployedJSON ])
    cogitoContext = await cogitoEthereum.getContext({ appName })

    mockTelepathChannel(cogitoContext.telepathChannel)
    process.env.REACT_APP_FAUCET_URL = 'https://faucet.url/donate'
    nock(process.env.REACT_APP_FAUCET_URL).post(`/${wallet.address}`, '').reply(200)
  })

  afterEach(() => {
    console.log.mockRestore && console.log.mockRestore()
  })

  it('can increase contract value', async () => {
    const { getByText, getByTestId, store: { dispatch } } = render(
      <CogitoContract channel={cogitoContext.telepathChannel} simpleStorageProxy={cogitoContext.contractsProxies.SimpleStorage} />
    )
    const currentValue = await waitForElement(() => getByTestId(/current-value/i))
    expect(currentValue).toHaveTextContent('0')
    setActiveTelepathChannel(dispatch)
    const increaseButton = getByText(/increase/i)
    fireEvent.click(increaseButton)
    await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${5}`))
  })
})
