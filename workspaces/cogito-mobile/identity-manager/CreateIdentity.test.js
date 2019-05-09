import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { CreateIdentity } from './CreateIdentity'
import { Navigation } from 'react-native-navigation'

describe('Create Identity', () => {
  const createButtonText = 'Create'
  const identityFieldTestId = 'identity-name'

  it('can be cancelled', () => {
    render(<CreateIdentity />)

    const identityManager = Navigation.events().boundComponents[0]
    identityManager.navigationButtonPressed({ buttonId: 'cancel' })

    expect(Navigation.dismissModal).toBeCalled()
  })

  it('has an empty name initially', () => {
    const { getByTestId } = render(<CreateIdentity />)

    expect(getByTestId(identityFieldTestId).props.value).toEqual('')
  })

  it('disables the create button when name is empty', () => {
    const { getByText } = render(<CreateIdentity />)

    expect(getByText(createButtonText).props.disabled).toBe(true)
  })

  it('enables the create button when name is not empty', () => {
    const { getByText, getByTestId } = render(<CreateIdentity />)

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)

    expect(getByText(createButtonText).props.disabled).toBe(false)
  })

  it('updates the state when name is changed', () => {
    const { getByTestId } = render(<CreateIdentity />)

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)

    expect(getByTestId(identityFieldTestId).props.value).toEqual(newName)
  })

  it('has a create button that can be pressed', () => {
    const { getByText } = render(<CreateIdentity />)

    fireEvent.press(getByText(createButtonText))

    expect(Navigation.dismissModal).toBeCalled()
  })
})
