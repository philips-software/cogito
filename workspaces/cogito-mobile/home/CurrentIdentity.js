import React from 'react'
import { Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { CreateIdentity } from '../identity-manager/CreateIdentity'

export const CurrentIdentityComponent = props => (
  <Text onPress={() => openCreateIdentityScreen()}>
    {props.identityName || 'Who am I?'}
  </Text>
)

const mapStateToProps = state => ({
  identityName:
    state.identity.identities.length > 0 ? state.identity.identities[0] : null
})
export const CurrentIdentity = connect(mapStateToProps)(
  CurrentIdentityComponent
)

function openCreateIdentityScreen () {
  Navigation.showModal(CreateIdentity.modalPresentationLayout)
}
