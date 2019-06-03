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

export class CreateIdentityComponent extends React.Component {
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
      <KeyboardAvoidingContainer>
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
          onSubmitEditing={() => this.handleCreateButton()}
          autoFocus
        />
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
    this.props.addIdentity(this.state.identityName)
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
