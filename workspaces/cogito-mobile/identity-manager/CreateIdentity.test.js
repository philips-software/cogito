import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { CreateIdentityComponent as CreateIdentity } from './CreateIdentity'
import { Navigation } from 'react-native-navigation'
import { KeyboardAvoidingContainer } from '../components'

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

  it('focuses on the name field', () => {
    const { getByTestId } = render(<CreateIdentity />)

    expect(getByTestId(identityFieldTestId).props.autoFocus).toBeTruthy()
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

  it('calls addIdentity with contents of text field', () => {
    const addIdentity = jest.fn()
    const { getByTestId, getByText } = render(
      <CreateIdentity addIdentity={addIdentity} />
    )

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)
    fireEvent.press(getByText(createButtonText))

    expect(addIdentity.mock.calls[0][0]).toBe(newName)
  })

  it('dismisses modal when add identity is successful', () => {
    const addIdentity = jest.fn()
    const { getByText } = render(<CreateIdentity addIdentity={addIdentity} />)

    fireEvent.press(getByText(createButtonText))

    expect(addIdentity).toHaveBeenCalled()
    expect(Navigation.dismissModal).toBeCalled()
  })

  it('prevents the keyboard from overlapping with the button', () => {
    const { queryByType } = render(
      <CreateIdentity />
    )

    expect(queryByType(KeyboardAvoidingContainer)).not.toBeNull()
  })
})
