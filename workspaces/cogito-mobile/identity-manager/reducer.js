import { createReducer } from 'redux-starter-kit'
import { add } from './actions'

export const initialState = { identities: [] }
export const identityReducer = createReducer(initialState, {
  [add]: (state, action) => {
    state.identities.push(action.payload)
  }
})
