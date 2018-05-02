import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { store, WithStore } from 'app-state'

import { Main } from './Main'

const App = () =>
  <WithStore.Provider value={{store}}>
    <Router>
      <Main />
    </Router>
  </WithStore.Provider>

export { App }
