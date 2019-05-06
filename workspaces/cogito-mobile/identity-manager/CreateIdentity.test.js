import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { CreateIdentity } from './CreateIdentity'
import { Navigation } from 'react-native-navigation'

describe('Create Identity', () => {
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

  it('has a create button that can be pressed', () => {
    const createButtonText = 'Create'
    const { getByText } = render(<CreateIdentity />)

    fireEvent.press(getByText(createButtonText))

    expect(Navigation.dismissModal).toBeCalled()
  })
})
