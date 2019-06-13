import { createAction } from 'redux-starter-kit'
import { Wallet } from 'ethers'

export const add = name => async dispatch => {
  dispatch(addIsPending())

  const wallet = await Wallet.createRandom()
  const encryptedWallet = await wallet.encrypt('password')
  dispatch(store({ name, wallet: encryptedWallet }))

  dispatch(addIsFinished())
}

export const addIsPending = createAction('identity/add/pending')
export const addIsFinished = createAction('identity/add/finished')
export const store = createAction('identity/store')
