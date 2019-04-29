import React from 'react'
import { Text, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import styles from '../Styles'
import { toolbarButton } from '../navigation/ToolbarButton'
import { CreateIdentity } from './create/CreateIdentity'

export class IdentityManager extends React.Component {
  static options () {
    return { topBar: {
      title: { text: 'Me, Myself and I' },
      rightButtons: [toolbarButton('add')]
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
    Navigation.showModal(CreateIdentity.modalPresentationLayout)
  }
}
