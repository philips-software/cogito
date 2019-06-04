import React from 'react'
import { Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { CreateIdentity } from '../identity-manager/CreateIdentity'
import { getIdentityName } from './selectors'

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

export const CurrentIdentity = connect(state => ({
  identityName: getIdentityName(state)
}))(CurrentIdentityComponent)
