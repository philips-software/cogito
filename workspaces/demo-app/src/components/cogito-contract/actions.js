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

const getAccount = async (getState, dispatch, channel, forceRefetchAddress) => {
  const { userData: { connectionEstablished, ethereumAddress } } = getState()

  if (connectionEstablished && !forceRefetchAddress) {
    return ethereumAddress
  }

  const requestedProperties = [
    CogitoIdentity.Property.EthereumAddress,
    CogitoIdentity.Property.Username
  ]
  const cogitoIdentity = new CogitoIdentity({ channel })
  const info = await cogitoIdentity.getInfo({ properties: requestedProperties })
  if (!info) throw new Error('No identity found on the mobile device!')
  dispatch(UserDataActions.setIdentityInfo(info))
  dispatch(UserDataActions.connectionEstablished())

  return info.ethereumAddress
}

class ContractActions {
  static increase = ({ increment, deployedContract: contract, channel, forceRefetchAddress = false }) => {
    return async (dispatch, getState) => {
      dispatch(AppEventsActions.telepathInProgress())
      try {
        const account = await getAccount(getState, dispatch, channel, forceRefetchAddress)
        // let's make sure the account has some funds
        transferFunds(account)
        await contract.increase(
          increment,
          { from: account }
        )
        dispatch(AppEventsActions.telepathFulfilled())
      } catch (error) {
        console.error(error)
        dispatch(AppEventsActions.telepathError({ reason: error.message }))
      }
    }
  }

  static read = ({ deployedContract: contract, channel, forceRefetchAddress = false }) => {
    return async (dispatch, getState) => {
      dispatch(AppEventsActions.telepathInProgress())
      try {
        await getAccount(getState, dispatch, channel, forceRefetchAddress)
        const response = await contract.read()
        const balance = response.toNumber()
        dispatch(UserDataActions.setBalance(balance))
        dispatch(AppEventsActions.telepathFulfilled())
      } catch (error) {
        console.error(error)
        dispatch(AppEventsActions.telepathError({ reason: error.message }))
      }
    }
  }
}

export { ContractActions }
