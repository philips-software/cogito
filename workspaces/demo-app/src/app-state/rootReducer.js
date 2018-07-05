import { combineReducers } from 'redux'
import appEvents from 'app-events/reducer'
import userData from 'user-data/reducer'

const appReducer = combineReducers({
  appEvents,
  userData
})

// See answer from Dan Abramov: https://stackoverflow.com/a/35641992/1272679
const rootReducer = (state, action) => {
  if (action.type === 'RESET_APPLICATION') {
    state = undefined
  }

  return appReducer(state, action)
}

export { rootReducer }
