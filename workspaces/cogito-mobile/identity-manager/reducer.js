import { createReducer } from 'redux-starter-kit'
import { store, addIsPending, addIsFinished } from './actions'

export const initialState = {}
export const identityReducer = createReducer(initialState, {
  [store]: (state, action) => {
    state.name = action.payload.name
  },
  [addIsPending]: (state, action) => {
    state.creating = true
  },
  [addIsFinished]: (state, action) => {
    delete state.creating
  }
})
