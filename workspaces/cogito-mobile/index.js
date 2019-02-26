import { Navigation } from 'react-native-navigation'
import { Home } from './Home'
import { IdentityManager } from './IdentityManager'

Navigation.registerComponent('Home', () => Home)
Navigation.registerComponent('IdentityManager', () => IdentityManager)

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: { stack: { children: [
      { component: { name: 'Home' } }
    ] } }
  })
})
