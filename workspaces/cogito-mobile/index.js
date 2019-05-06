import { Navigation } from 'react-native-navigation'
import { Home } from './home'
import { CreateIdentity } from './identity-manager'

Navigation.registerComponent('Home', () => Home)
Navigation.registerComponent('CreateIdentity', () => CreateIdentity)

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: { stack: { children: [
      { component: { name: 'Home' } }
    ] } }
  })
})
