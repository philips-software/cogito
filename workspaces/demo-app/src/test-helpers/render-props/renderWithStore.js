import React from 'react'
import { render } from 'react-testing-library'
import { createStore } from 'redux'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { rootReducer } from 'app-state/rootReducer'

const renderWithStore = (
  ui,
  {
    reducer = rootReducer,
    initialState,
    store = createStore(reducer, initialState)
  } = {}) => {
  return {
    ...render(
      <WithStore.Provider value={{store}}>
        { ui }
      </WithStore.Provider>
    ),
    store
  }
}

export { renderWithStore }
