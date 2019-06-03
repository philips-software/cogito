import React from 'react'
import { View } from 'react-native'
import styles from '../Styles'
import { CurrentIdentity } from '../identity-manager/CurrentIdentity'

export class Home extends React.Component {
  static options () {
    return { topBar: { visible: false, drawBehind: true } }
  }

  render () {
    return (
      <View style={styles.container}>
        <CurrentIdentity />
      </View>
    )
  }
}
