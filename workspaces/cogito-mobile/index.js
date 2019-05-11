import { Navigation } from 'react-native-navigation'
import { Home } from './home'
import { CreateIdentity } from './identity-manager'
import { store } from './store'
import { Provider } from 'react-redux'
import React from 'react'

Navigation.registerComponent(
  'Home',
  () => props => (
    <Provider store={store}>
      <Home {...props} />
    </Provider>
  ),
  () => Home
)
Navigation.registerComponent(
  'CreateIdentity',
  () => props => (
    <Provider store={store}>
      <CreateIdentity {...props} />
    </Provider>
  ),
  () => CreateIdentity
)

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: { stack: { children: [{ component: { name: 'Home' } }] } }
  })
})
