import React from 'react'
import { render } from 'react-native-testing-library'
import { Navigation } from 'react-native-navigation'
import { IdentityManager } from './IdentityManager'
import { CreateIdentity } from './CreateIdentity'

it('can add an identity', () => {
  render(<IdentityManager />)

  const identityManager = Navigation.events().boundComponents[0]
  identityManager.navigationButtonPressed({ buttonId: 'add' })

  const layout = Navigation.showModal.mock.calls[0][0]
  expect(layout).toEqual(CreateIdentity.modalPresentationLayout)
})
