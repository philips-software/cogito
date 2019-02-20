import { createStackNavigator, createAppContainer } from 'react-navigation'
import { useScreens } from 'react-native-screens'
import { Home } from './Home'
import { IdentityManager } from './IdentityManager'

useScreens()

const AppNavigator = createStackNavigator({ Home, IdentityManager }, {
  headerMode: 'float',
  headerTransitionPreset: 'uikit'
})
export default createAppContainer(AppNavigator)
