import { Navigation } from 'react-native-navigation'
import { Home } from './Home'
import { IdentityManager } from './IdentityManager'
import { CreateIdentity } from './CreateIdentity'

Navigation.registerComponent('Home', () => Home)
Navigation.registerComponent('IdentityManager', () => IdentityManager)
Navigation.registerComponent('CreateIdentity', () => CreateIdentity)

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: { stack: { children: [
      { component: { name: 'Home' } }
    ] } }
  })
})
