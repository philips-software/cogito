import { combineReducers } from 'redux'
import appEvents from 'app-events/reducer'
import userData from 'user-data/reducer'
import { encryptionReducer } from 'encryption-state/reducer'
import { attestationsReducer } from 'attestations-state/reducer'

const appReducer = combineReducers({
  appEvents,
  userData,
  encryption: encryptionReducer,
  attestations: attestationsReducer
})

// See answer from Dan Abramov: https://stackoverflow.com/a/35641992/1272679
const rootReducer = (state, action) => {
  if (action.type === 'RESET_APPLICATION') {
    state = undefined
  }

  return appReducer(state, action)
}

export { rootReducer }
