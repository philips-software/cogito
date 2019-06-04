import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { CreateIdentityComponent } from './CreateIdentity'
import { Navigation } from 'react-native-navigation'
import { KeyboardAvoidingContainer } from '../components'

describe('CreateIdentityComponent', () => {
  const createButtonText = 'Create'
  const identityFieldTestId = 'identity-name'
  const addIdentity = jest.fn()

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

  it('adds identity when button is pressed', () => {
    const { getByTestId, getByText } = render(
      <CreateIdentityComponent addIdentity={addIdentity} />
    )

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)
    fireEvent.press(getByText(createButtonText))

    expect(addIdentity.mock.calls[0][0]).toBe(newName)
  })

  it('adds an identity when key is pressed', () => {
    const { getByTestId } = render(
      <CreateIdentityComponent addIdentity={addIdentity} />
    )

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)
    fireEvent(getByTestId(identityFieldTestId), 'submitEditing')

    expect(addIdentity.mock.calls[0][0]).toBe(newName)
  })

  it('dismisses modal when add identity is successful', () => {
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
    const invalidName = ' \t\n'

    it('refuses an identity name with only whitespace', () => {
      const { getByTestId, getByText } = render(
        <CreateIdentityComponent addIdentity={addIdentity} />
      )

      fireEvent.changeText(getByTestId(identityFieldTestId), invalidName)
      fireEvent.press(getByText(createButtonText))

      expect(addIdentity).not.toHaveBeenCalled()
    })

    it('does not show an error initially', () => {
      const { queryByText } = render(
        <CreateIdentityComponent addIdentity={addIdentity} />
      )

      expect(queryByText('Name is invalid. It may not be only whitespaces')).toBeNull()
    })

    it('shows an error message when the name is refuses', () => {
      const { getByTestId, getByText, queryByText } = render(
        <CreateIdentityComponent addIdentity={addIdentity} />
      )

      fireEvent.changeText(getByTestId(identityFieldTestId), invalidName)
      fireEvent.press(getByText(createButtonText))

      expect(queryByText('Name is invalid. It may not be only whitespaces')).not.toBeNull()
    })
  })
})