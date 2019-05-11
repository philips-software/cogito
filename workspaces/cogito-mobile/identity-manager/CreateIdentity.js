import React from 'react'
import {
  TextInput,
  Button,
  Text,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { layout } from './Layout'
import styles from '../Styles'

export class CreateIdentity extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      identityName: '',
      buttonDisabled: true
    }

    Navigation.events().bindComponent(this)
  }

  render () {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text>I am more.</Text>
        <TextInput
          testID='identity-name'
          style={Object.assign({}, styles.textInput, {
            width: '100%',
            margin: 40,
            textAlign: 'center'
          })}
          placeholder='e.g. your name or "work"'
          value={this.state.identityName}
          onChangeText={text => this.handleTextInput(text)}
          autoFocus
        />
        <Button
          title='Create'
          onPress={() => this.handleCreateButton()}
          disabled={this.state.buttonDisabled}
        />
      </KeyboardAvoidingView>
    )
  }

  handleTextInput (text) {
    this.setState({ identityName: text, buttonDisabled: text === '' })
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
      children: [{ component: { name: 'CreateIdentity' } }]
    }
  }

  static options () {
    return layout
  }
}
