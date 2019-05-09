import React from 'react'
import { TextInput, View, Button } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { layout } from './Layout'
import styles from '../Styles'

export class CreateIdentity extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      identityName: ''
    }

    Navigation.events().bindComponent(this)
  }

  render () {
    return (
      <View style={styles.container}>
        <TextInput testID='identity-name'
          value={this.state.identityName}
          onChangeText={(text) => this.handleTextInput(text)} />
        <Button
          title='Create'
          onPress={() => this.handleCreateButton()}
          disabled />
      </View>
    )
  }

  handleTextInput (text) {
    this.setState({ identityName: text })
  }

  handleCreateButton () {
    const { componentId } = this.props
    Navigation.dismissModal(componentId)
  }

  navigationButtonPressed () {
    const { componentId } = this.props
    Navigation.dismissModal(componentId)
  }

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
}
