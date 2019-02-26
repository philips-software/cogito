import React from 'react'
import { Text, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import styles from './Styles'

export class Home extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Text onPress={() => this.openIdentityManager()}>I am.</Text>
      </View>
    )
  }

  openIdentityManager () {
    const { componentId } = this.props
    Navigation.push(componentId, {
      component: { name: 'IdentityManager' },
      options: {
          topBar: { title: { text: 'Me, Myself and I' } }
      }
    })
  }
}
