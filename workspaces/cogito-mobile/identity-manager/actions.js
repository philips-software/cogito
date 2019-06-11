import { createAction } from 'redux-starter-kit'
import { Wallet } from 'ethers'

export const add = name => async dispatch => {
  const wallet = await Wallet.createRandom()
  dispatch(store({ name, wallet }))
}

export const store = createAction('identity/store')
