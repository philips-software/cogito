import React from 'react'
import { Text, View } from 'react-native'
import styles from './Styles'

export class IdentityManager extends React.Component {
  static options() {
    return { topBar: { title: { text: 'Me, Myself and I' } } }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text>Identity Manager</Text>
      </View>  
    )
  }
}
