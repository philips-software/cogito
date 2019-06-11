import { createReducer } from 'redux-starter-kit'
import { store } from './actions'

export const initialState = {}
export const identityReducer = createReducer(initialState, {
  [store]: (state, action) => {
    state.name = action.payload.name
  }
})
