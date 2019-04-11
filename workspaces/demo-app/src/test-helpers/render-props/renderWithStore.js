import React from 'react'
import { render } from 'react-testing-library'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { rootReducer } from 'app-state/rootReducer'

const renderWithStore = (
  ui,
  {
    reducer = rootReducer,
    initialState,
    store = createStore(
      reducer,
      initialState,
      applyMiddleware(thunkMiddleware)
    )
  } = {}
) => {
  return {
    ...render(<WithStore.Provider value={{ store }}>{ui}</WithStore.Provider>),
    store
  }
}

const rerenderWithStore = (rerender, ui, store) => {
  return {
    ...rerender(
      <WithStore.Provider value={{ store }}>{ui}</WithStore.Provider>
    ),
    store
  }
}

export { renderWithStore, rerenderWithStore }
