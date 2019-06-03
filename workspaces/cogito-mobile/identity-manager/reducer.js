import { createReducer } from 'redux-starter-kit'
import { add } from './actions'

export const initialState = {}
export const identityReducer = createReducer(initialState, {
  [add]: (state, action) => {
    state.name = action.payload.name
  }
})
