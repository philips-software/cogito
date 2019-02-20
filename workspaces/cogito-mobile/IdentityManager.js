import React from 'react'
import { Text, View } from 'react-native'
import { container } from './Styles'

export class IdentityManager extends React.Component {
  static navigationOptions = { title: 'Me, Myself and I' }

  render () {
    return (
      <View style={container}>
        <Text>Identity Manager</Text>
      </View>
    )
  }
}
