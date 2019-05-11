import React from 'react'
import { View } from 'react-native'
import styles from '../Styles'
import { CurrentIdentity } from './CurrentIdentity'
import { Provider } from 'react-redux'
import { store } from '../store'

export class Home extends React.Component {
  static options () {
    return { topBar: { visible: false, drawBehind: true } }
  }

  render () {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <CurrentIdentity />
        </View>
      </Provider>
    )
  }
}
