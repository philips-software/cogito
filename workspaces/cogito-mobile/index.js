import { Navigation } from 'react-native-navigation'
import App from './App'
import { IdentityManager } from './IdentityManager'

Navigation.registerComponent('App', () => App)
Navigation.registerComponent('IdentityManager', () => IdentityManager)

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: { stack: { children: [
      { component: { name: 'App' } }
    ] } }
  })
})
