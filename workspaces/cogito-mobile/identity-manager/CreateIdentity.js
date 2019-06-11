import React from 'react'
import { Input, Button } from 'react-native-elements'
import { KeyboardAvoidingContainer } from '../components'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { layout } from './Layout'
import styles from '../Styles'
import * as identityActions from '../identity-manager/actions'

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
        <Input
          testID='identity-name'
          label='I am more.'
          placeholder='E.g. your name or "work"'
          value={this.state.identityName}
          onChangeText={text => this.handleTextInput(text)}
          onSubmitEditing={() => this.handleCreateButton()}
          errorStyle={styles.errorMessageText}
          errorMessage={this.state.errorMessage}
          shake
          autoFocus
        />
        <Button
          testID='create-button'
          title='Create'
          type='outline'
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
      this.setState({ errorMessage: 'Name is invalid; it consists of whitespace only' })
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
    return name.trim() !== ''
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
    dispatch(identityActions.add(name))
  }
})

export const CreateIdentity = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateIdentityComponent)
