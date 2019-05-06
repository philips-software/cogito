import React from 'react'
import { render } from 'react-native-testing-library'
import { CreateIdentity } from './CreateIdentity'
import { Navigation } from 'react-native-navigation'

it('can be cancelled', () => {
  render(<CreateIdentity />)

  const identityManager = Navigation.events().boundComponents[0]
  identityManager.navigationButtonPressed({ buttonId: 'cancel' })

  expect(Navigation.dismissModal).toBeCalled()
})

it('has an empty name initially', () => {
  const { getByTestId } = render(<CreateIdentity />)
  expect(getByTestId('identity-name').props.value).toEqual('')
})
