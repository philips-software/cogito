import React from 'react'
import { NavigatorIOS, StyleSheet, Text, View } from 'react-native'

const App = () => (
  <NavigatorIOS
    initialRoute={{ component: Home, title: 'Home' }}
    style={{ flex: 1 }}
  />
)

class Home extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Text onPress={() => this.openIdentityManager()}>I am.</Text>
      </View>
    )
  }

  openIdentityManager () {
    const { navigator } = this.props
    navigator.push({ component: IdentityManager, title: 'Me, Myself and I' })
  }
}

const IdentityManager = () => (
  <View style={styles.container}>
    <Text>Identity Manager</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default App
