import React from 'react'
import { Text, View } from 'react-native'
import { IdentityManager } from './IdentityManager'
import { container } from './Styles'

export class Home extends React.Component {
  static route = {
    component: Home,
    title: 'Home',
    navigationBarHidden: true
  }

  render () {
    return (
      <View style={container}>
        <Text onPress={() => this.openIdentityManager()}>I am.</Text>
      </View>
    )
  }

  openIdentityManager () {
    const { navigator } = this.props
    navigator.push(IdentityManager.route)
  }
}
