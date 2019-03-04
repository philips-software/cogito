import React from 'react'
import { Text, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import styles from './Styles'

export class Home extends React.Component {
  static options () {
    return { topBar: { visible: false, drawBehind: true } }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text onPress={() => this.openIdentityManager()}>
          I am.
        </Text>
      </View>
    )
  }

  openIdentityManager () {
    const { componentId } = this.props
    Navigation.push(componentId, { component: { name: 'IdentityManager' } })
  }
}
