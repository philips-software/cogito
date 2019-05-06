import React from 'react'
import { TextInput, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { layout } from './Layout'
import styles from '../Styles'

export class CreateIdentity extends React.Component {
  static modalPresentationLayout = {
    stack: {
      children: [
        { component: { name: 'CreateIdentity' } }
      ]
    }
  }

  static options () {
    return layout
  }

  constructor (props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  render () {
    return (
      <View style={styles.container}>
        <TextInput testID='identity-name' value='' />
      </View>
    )
  }

  navigationButtonPressed () {
    const { componentId } = this.props
    Navigation.dismissModal(componentId)
  }
}
