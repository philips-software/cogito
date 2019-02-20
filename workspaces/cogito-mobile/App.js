import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Home } from './Home'
import { IdentityManager } from './IdentityManager'

const AppNavigator = createStackNavigator({ Home, IdentityManager }, {
  headerMode: 'float',
  headerTransitionPreset: 'uikit'
})
export default createAppContainer(AppNavigator)
