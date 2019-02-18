import React from 'react'
import { NavigatorIOS, StyleSheet, Text, View } from 'react-native'

const App = () => (
  <NavigatorIOS
    initialRoute={Home.route}
    style={{ flex: 1 }}
  />
)

class Home extends React.Component {
  static route = {
    component: Home,
    title: 'Home',
    navigationBarHidden: true
  }

  render () {
    return (
      <View style={styles.container}>
        <Text onPress={() => this.openIdentityManager()}>I am.</Text>
      </View>
    )
  }

  openIdentityManager () {
    const { navigator } = this.props
    navigator.push(IdentityManager.route)
  }
}

class IdentityManager extends React.Component {
  static route = {
    component: IdentityManager,
    title: 'Me, Myself and I',
    rightButtonSystemIcon: 'add'
  }

  render () {
    return (
      <View style={styles.container}>
        <Text>Identity Manager</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default App
