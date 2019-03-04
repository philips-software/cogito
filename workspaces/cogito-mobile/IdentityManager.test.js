import React from 'react'
import { render } from 'react-native-testing-library'
import { IdentityManager } from './IdentityManager'
import { Navigation } from 'react-native-navigation'

it('can add an identity', () => {
  render(<IdentityManager />)

  const identityManager = Navigation.events().boundComponents[0]
  identityManager.navigationButtonPressed({ buttonId: 'addIdentity' })

  const layout = Navigation.showModal.mock.calls[0][0]
  expect(layout.component.name).toEqual('CreateIdentity')
})
