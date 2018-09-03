import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'semantic-ui-css/semantic.min.css'
import { App } from 'app'
import registerServiceWorker from './registerServiceWorker'

// hot-reloading, see https://medium.com/superhighfives/hot-reloading-create-react-app-73297a00dcad
const rootEl = document.getElementById('root')

ReactDOM.render(
  <App />,
  rootEl
)

if (module.hot) {
  module.hot.accept('app', () => {
    const NextApp = require('app').default
    ReactDOM.render(
      <NextApp />,
      rootEl
    )
  })
}
registerServiceWorker()
