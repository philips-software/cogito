import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { CreateIdentityComponent } from './CreateIdentity'
import { Navigation } from 'react-native-navigation'

describe('CreateIdentityComponent', () => {
  const createButtonTestId = 'create-button'
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
    const { getByTestId } = render(<CreateIdentityComponent />)

    expect(getByTestId(createButtonTestId).props.disabled).toBe(true)
  })

  it('enables the create button when name is not empty', () => {
    const { getByTestId } = render(<CreateIdentityComponent />)

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)

    expect(getByTestId(createButtonTestId).props.disabled).toBe(false)
  })

  it('updates the state when name is changed', () => {
    const { getByTestId } = render(<CreateIdentityComponent />)

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)

    expect(getByTestId(identityFieldTestId).props.value).toEqual(newName)
  })

  it('adds identity when button is pressed', () => {
    const { getByTestId } = render(
      <CreateIdentityComponent addIdentity={addIdentity} />
    )

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)
    fireEvent.press(getByTestId(createButtonTestId))

    expect(addIdentity.mock.calls[0][0]).toBe(newName)
  })

  it('adds an identity when key is pressed', () => {
    const { getByTestId } = render(
      <CreateIdentityComponent addIdentity={addIdentity} />
    )

    const newName = 'New Name'
    fireEvent.changeText(getByTestId(identityFieldTestId), newName)
    fireEvent.submitEditing(getByTestId(identityFieldTestId))

    expect(addIdentity.mock.calls[0][0]).toBe(newName)
  })

  it('does not show a spinner initially', () => {
    const { getByTestId } = render(<CreateIdentityComponent />)

    expect(getByTestId('loading-indicator').props.animating).toBeFalsy()
  })

  it('shows a spinner when loading', () => {
    const { getByTestId } = render(<CreateIdentityComponent loading />)

    expect(getByTestId('loading-indicator').props.animating).toBe(true)
  })

  it('adds an identity when create button is pressed', () => {
    const { getByTestId } = render(<CreateIdentityComponent addIdentity={addIdentity} />)
    fireEvent.changeText(getByTestId(identityFieldTestId), 'some name')
    fireEvent.press(getByTestId(createButtonTestId))
    expect(addIdentity).toHaveBeenCalled()
  })

  it('dismisses modal when identity is created', () => {
    const { rerender } = render(<CreateIdentityComponent />)
    rerender(<CreateIdentityComponent done />)
    expect(Navigation.dismissModal).toBeCalled()
  })

  it('dismisses modal only once', () => {
    const { rerender } = render(<CreateIdentityComponent />)
    rerender(<CreateIdentityComponent done />)
    rerender(<CreateIdentityComponent done />)
    expect(Navigation.dismissModal).toBeCalledTimes(1)
  })

  it('prevents the keyboard from overlapping with the button', () => {
    const { queryByTestId } = render(
      <CreateIdentityComponent />
    )

    expect(queryByTestId('keyboard-avoiding-container')).not.toBeNull()
  })

  describe('validation', () => {
    const invalidName = ' \t\n'

    it('refuses an identity name with only whitespace', () => {
      const { getByTestId } = render(
        <CreateIdentityComponent addIdentity={addIdentity} />
      )

      fireEvent.changeText(getByTestId(identityFieldTestId), invalidName)
      fireEvent.press(getByTestId(createButtonTestId))

      expect(addIdentity).not.toHaveBeenCalled()
    })

    it('does not show an error initially', () => {
      const { queryByText } = render(
        <CreateIdentityComponent addIdentity={addIdentity} />
      )

      expect(queryByText('Name is invalid. It may not be only whitespaces')).toBeNull()
    })

    it('shows an error message when the name is refused', () => {
      const { getByTestId, queryByText } = render(
        <CreateIdentityComponent addIdentity={addIdentity} />
      )

      fireEvent.changeText(getByTestId(identityFieldTestId), invalidName)
      fireEvent.press(getByTestId(createButtonTestId))

      expect(queryByText('Name is invalid; it consists of whitespace only')).not.toBeNull()
    })
  })
})
