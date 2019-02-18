import React from 'react'
import { NavigatorIOS } from 'react-native'
import { Home } from './Home'

const App = () => (
  <NavigatorIOS
    initialRoute={Home.route}
    style={{ flex: 1 }}
  />
)

export default App
