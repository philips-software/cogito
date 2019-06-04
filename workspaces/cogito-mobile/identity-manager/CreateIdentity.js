import React from 'react'
import {
  TextInput,
  Button,
  Text
} from 'react-native'
import { KeyboardAvoidingContainer } from '../components'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { layout } from './Layout'
import styles from '../Styles'
import * as identityActions from '../identity-manager/actions'
import _ from 'lodash'

export class CreateIdentityComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      identityName: '',
      buttonDisabled: true,
      errorMessage: null
    }

    Navigation.events().bindComponent(this)
  }

  render () {
    return (
      <KeyboardAvoidingContainer>
        <Text>I am more.</Text>
        <TextInput
          testID='identity-name'
          style={[styles.textInput, styles.identityNameTextInput]}
          placeholder='e.g. your name or "work"'
          value={this.state.identityName}
          onChangeText={text => this.handleTextInput(text)}
          onSubmitEditing={() => this.handleCreateButton()}
          autoFocus
        />
        { this.state.errorMessage !== null &&
        <Text style={styles.errorMessageText}>{this.state.errorMessage}</Text>
        }
        <Button
          title='Create'
          onPress={() => this.handleCreateButton()}
          disabled={this.state.buttonDisabled}
        />
      </KeyboardAvoidingContainer>
    )
  }

  handleTextInput (text) {
    this.setState({ identityName: text, buttonDisabled: text === '' })
  }

  handleCreateButton () {
    const name = this.state.identityName

    if (!this.isValidName(name)) {
      this.setState({ errorMessage: 'Name is invalid. It may not be only whitespaces' })
      return
    }

    this.props.addIdentity(name)
    const { componentId } = this.props
    Navigation.dismissModal(componentId)
  }

  navigationButtonPressed () {
    const { componentId } = this.props
    Navigation.dismissModal(componentId)
  }

  isValidName (name) {
    const trimmedName = name.trim()
    return !_.isEmpty(trimmedName)
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

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  addIdentity: name => {
    dispatch(identityActions.add({ name }))
  }
})

export const CreateIdentity = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateIdentityComponent)
