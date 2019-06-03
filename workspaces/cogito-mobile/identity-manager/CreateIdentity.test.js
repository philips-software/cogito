import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { CreateIdentityComponent } from './CreateIdentity'
import { Navigation } from 'react-native-navigation'
import { KeyboardAvoidingContainer } from '../components'

describe('CreateIdentityComponent', () => {
  const createButtonText = 'Create'
  const identityFieldTestId = 'identity-name'

  it('can be cancelled', () => {
    render(<CreateIdentityComponent />)

    const identityManager = Navigation.events().boundComponents[0]
    identityManager.navigationButtonPressed({ buttonId: 'cancel' })

    expect(Navigation.dismissModal).toBeCalled()
  })

  it('has an empty name initially', () => {
    const { getByTestId } = render(<CreateIdentityComponent />)

    expect(getByTestId(identityFieldTestId).props.value).toEqual('')
  })

  it('focuses on the name field', () => {
    const { getByTestId } = render(<CreateIdentityComponent />)

    expect(getByTestId(identityFieldTestId).props.autoFocus).toBeTruthy()
  })

  it('disables the create button when name is empty', () => {
    const { getByText } = render(<CreateIdentityComponent />)

    expect(getByText(createButtonText).props.disabled).toBe(true)
  })

  it('enables the create button when name is not empty', () => {
    const { getByText, getByTestId } = render(<CreateIdentityComponent />)

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)

    expect(getByText(createButtonText).props.disabled).toBe(false)
  })

  it('updates the state when name is changed', () => {
    const { getByTestId } = render(<CreateIdentityComponent />)

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)

    expect(getByTestId(identityFieldTestId).props.value).toEqual(newName)
  })

  it('calls addIdentity with contents of text field', () => {
    const addIdentity = jest.fn()
    const { getByTestId, getByText } = render(
      <CreateIdentityComponent addIdentity={addIdentity} />
    )

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)
    fireEvent.press(getByText(createButtonText))

    expect(addIdentity.mock.calls[0][0]).toBe(newName)
  })

  it('calls addIdentity when onSubmitEditing is called', () => {
    const addIdentity = jest.fn()
    const { getByTestId } = render(
      <CreateIdentityComponent addIdentity={addIdentity} />
    )

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)
    fireEvent(getByTestId(identityFieldTestId), 'submitEditing')

    expect(addIdentity.mock.calls[0][0]).toBe(newName)
  })

  it('dismisses modal when add identity is successful', () => {
    const addIdentity = jest.fn()
    const { getByText, getByTestId } = render(<CreateIdentityComponent addIdentity={addIdentity} />)

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)
    fireEvent.press(getByText(createButtonText))

    expect(addIdentity).toHaveBeenCalled()
    expect(Navigation.dismissModal).toBeCalled()
  })

  it('prevents the keyboard from overlapping with the button', () => {
    const { queryByType } = render(
      <CreateIdentityComponent />
    )

    expect(queryByType(KeyboardAvoidingContainer)).not.toBeNull()
  })

  describe('validation', () => {
    it('refuses an identity name with only whitespace', () => {
      const addIdentity = jest.fn()
      const { getByTestId, getByText } = render(
        <CreateIdentityComponent addIdentity={addIdentity} />
      )

      const invalidName = ' \t\n'
      fireEvent.changeText(getByTestId(identityFieldTestId), invalidName)
      fireEvent.press(getByText(createButtonText))

      expect(addIdentity).not.toHaveBeenCalled()
    })
  })
})
