import { AppEventsActions } from 'app-events'
import { UserDataActions } from 'user-data'
import { FaucetService } from 'faucet'

import { CogitoIdentity } from '@cogitojs/cogito-identity'

const getFaucetURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.FAUCET_URL_PRODUCTION
  }

  return process.env.FAUCET_URL || 'http://localhost:3001/donate'
}

const transferFunds = async (account) => {
  const faucet = new FaucetService(getFaucetURL())
  await faucet.transferFunds(account)
}

const getAccount = async (getState, dispatch, channel) => {
  const { userData: { ethereumAddress } } = getState()

  let fetchedAccount

  if (!ethereumAddress) {
    const requestedProperties = [
      CogitoIdentity.Property.EthereumAddress,
      CogitoIdentity.Property.Username
    ]
    const cogitoIdentity = new CogitoIdentity({ channel })
    const info = await cogitoIdentity.getInfo({ properties: requestedProperties })
    if (!info) return undefined
    dispatch(UserDataActions.setIdentityInfo(info))
    console.log('userIdentity:', info)
  } else {
    fetchedAccount = ethereumAddress
  }

  return fetchedAccount
}

class ContractActions {
  static increase = ({ increment, deployedContract: contract, channel }) => {
    return async (dispatch, getState) => {
      dispatch(AppEventsActions.executingContractInProgress())
      const account = await getAccount(getState, dispatch, channel)

      if (!account) {
        console.error('No accounts. Please handle that first!')
        dispatch(AppEventsActions.executingContractError())
        return
      }

      // let's make sure the account has some funds
      transferFunds(account)

      try {
        await contract.increase(
          increment,
          { from: account }
        )
        dispatch(AppEventsActions.executingContractFulfilled())
      } catch (error) {
        console.error('Error executing contract method increment: ', error)
        dispatch(AppEventsActions.executingContractError())
      }
    }
  }

  static read = ({ deployedContract: contract, channel }) => {
    return async (dispatch, getState) => {
      dispatch(AppEventsActions.executingContractInProgress())
      const account = await getAccount(getState, dispatch, channel)

      if (!account) {
        console.error('No accounts. Please handle that first!')
        dispatch(AppEventsActions.executingContractError())
        return
      }

      try {
        const response = await contract.read(
          { from: account }
        )
        const balance = response.toNumber()
        dispatch(UserDataActions.setBalance(balance))
        dispatch(AppEventsActions.executingContractFulfilled())
      } catch (error) {
        console.error('Error executing contract method read: ', error)
        dispatch(AppEventsActions.executingContractError())
      }
    }
  }
}

export { ContractActions }
