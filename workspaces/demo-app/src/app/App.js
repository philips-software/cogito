import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from 'app-state'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'

import { Main } from './Main'

const App = () =>
  <WithStore.Provider value={{store}}>
    <Router>
      <Main />
    </Router>
  </WithStore.Provider>

export { App }
