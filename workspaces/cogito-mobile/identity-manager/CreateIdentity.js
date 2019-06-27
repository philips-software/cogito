import React from 'react'
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native'
import { KeyboardAvoidingContainer } from '../components'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { layout } from './Layout'
import styles from '../Styles'
import * as identityActions from '../identity-manager/actions'
import { isCreatingIdentity, wasIdentityCreated } from './selectors'

export class CreateIdentityComponent extends React.Component {
  constructor (props) {
    super(props)
    this.componentId = this.props.componentId

    this.state = {
      identityName: '',
      buttonDisabled: true,
      errorMessage: null,
      dismissed: false
    }

    Navigation.events().bindComponent(this)
  }

  componentDidUpdate () {
    if (this.props.done && !this.state.dismissed) {
      Navigation.dismissModal(this.componentId)
      this.setState({ dismissed: true })
    }
  }

  render () {
    return (
      <KeyboardAvoidingContainer>
        <TextInput
          testID='identity-name'
          label='I am more.'
          placeholder='E.g. your name or "work"'
          value={this.state.identityName}
          onChangeText={text => this.handleTextInput(text)}
          onSubmitEditing={() => this.handleCreateButton()}
          errorStyle={styles.errorMessageText}
          errorMessage={this.state.errorMessage}
          autoFocus
        />
        { this.state.errorMessage !== null &&
          <Text style={styles.errorMessageText}>{this.state.errorMessage}</Text>
        }
        <View style={{ flexDirection: 'row' }}>
          <Button
            testID='create-button'
            title='Create'
            type='outline'
            onPress={() => this.handleCreateButton()}
            disabled={this.state.buttonDisabled}
          />
          <ActivityIndicator
            testID='loading-indicator'
            animating={!!this.props.loading}
          />
        </View>
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
  }

  navigationButtonPressed () {
    Navigation.dismissModal(this.componentId)
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

const mapStateToProps = state => ({
  loading: isCreatingIdentity(state),
  done: wasIdentityCreated(state)
})
const mapDispatchToProps = dispatch => ({
  addIdentity: name => {
    dispatch(identityActions.add(name))
  }
})

export const CreateIdentity = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateIdentityComponent)
