import React from 'react'
import { Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { CreateIdentity } from '../identity-manager/CreateIdentity'

export const CurrentIdentity = () => (
  <Text onPress={() => openCreateIdentityScreen()}>Who am I?</Text>
)

function openCreateIdentityScreen () {
  Navigation.showModal(CreateIdentity.modalPresentationLayout)
}
