import React from 'react'
import { Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { CreateIdentity } from '../identity-manager/CreateIdentity'

export class CurrentIdentityComponent extends React.Component {
  render () {
    if (this.props.identityName) {
      return (
        <Text>
          {this.props.identityName}
        </Text>
      )
    }

    return (
      <Text onPress={() => this.openCreateIdentityScreen()}>
        {'Who am I?'}
      </Text>
    )
  }

  openCreateIdentityScreen () {
    Navigation.showModal(CreateIdentity.modalPresentationLayout)
  }
}

const mapStateToProps = state => ({
  identityName:
    state.identity.name
})

export const CurrentIdentity = connect(
  mapStateToProps
)(CurrentIdentityComponent)
