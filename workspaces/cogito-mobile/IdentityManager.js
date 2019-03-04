import React from 'react'
import { Text, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import styles from './Styles'

export class IdentityManager extends React.Component {
  static options () {
    return { topBar: {
      title: { text: 'Me, Myself and I' },
      rightButtons: [
        {
          id: 'addIdentity',
          text: 'add',
          systemItem: 'add'
        }
      ]
    } }
  }

  constructor (props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  render () {
    return (
      <View style={styles.container}>
        <Text>Identity Manager</Text>
      </View>
    )
  }

  navigationButtonPressed () {
    Navigation.showModal({
      component: { name: 'CreateIdentity' }
    })
  }
}
