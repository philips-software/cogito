import { AppEventsActions } from 'app-events'
import { UserDataActions } from 'user-data'

const fetchAccount = async (dispatch, web3) => {
  dispatch(AppEventsActions.accountsFetchingInProgress())

  const accounts = await web3.eth.getAccounts()

  dispatch(AppEventsActions.accountsFetchingFulfilled())
  dispatch(UserDataActions.connectionEstablished())
  if (accounts.length === 0) {
    return undefined
  }
  return accounts[0]
}

const getAccount = async (getState, dispatch, web3) => {
  const { userData: { account } } = getState()

  let fetchedAccount

  if (!account) {
    fetchedAccount = await fetchAccount(dispatch, web3)
    if (!fetchedAccount) return undefined
    console.log('fetchedAccount', fetchedAccount)
    dispatch(UserDataActions.setAccount(fetchedAccount))
  } else {
    fetchedAccount = account
  }

  return fetchedAccount
}

class ContractActions {
  static increase = ({ increment, deployedContract: contract, web3 }) => {
    return async (dispatch, getState) => {
      dispatch(AppEventsActions.executingContractInProgress())
      const account = await getAccount(getState, dispatch, web3)

      if (!account) {
        console.error('No accounts. Please handle that first!')
        dispatch(AppEventsActions.executingContractError())
        return
      }

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

  static read = ({ deployedContract: contract, web3 }) => {
    return async (dispatch, getState) => {
      dispatch(AppEventsActions.executingContractInProgress())
      const account = await getAccount(getState, dispatch, web3)

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
