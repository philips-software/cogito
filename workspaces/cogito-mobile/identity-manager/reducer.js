import { createReducer } from 'redux-starter-kit'
import { store, addIsPending, addIsFinished } from './actions'

export const initialState = {}
export const identityReducer = createReducer(initialState, {
  [store]: (state, action) => {
    Object.assign(state, action.payload)
  },
  [addIsPending]: (state, action) => {
    state.creating = true
  },
  [addIsFinished]: (state, action) => {
    delete state.creating
  }
})
