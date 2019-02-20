import React from 'react'
import { Text, View } from 'react-native'
import { container } from './Styles'

export class Home extends React.Component {
  static navigationOptions = { header: null }

  render () {
    return (
      <View style={container}>
        <Text onPress={() => this.openIdentityManager()}>I am.</Text>
      </View>
    )
  }

  openIdentityManager () {
    const { navigation } = this.props
    navigation.navigate('IdentityManager')
  }
}
