import React from 'react'
import { render, fireEvent } from 'test-helpers/render-props'
import { IncreaseContractButton } from './IncreaseContractButton'
import { AppEventsActions } from 'app-events'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('IncreaseContractButton', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <IncreaseContractButton />
    )

    expect(container).not.toBeEmpty()
  })

  it('is disabled if app event telepathInProgress is set', () => {
    const { getByText, store: { dispatch } } = render(
      <IncreaseContractButton onClick={() => {
        dispatch(AppEventsActions.telepathInProgress())
      }} />
    )

    const button = getByText(/increase/i)

    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    expect(button).toBeDisabled()
  })

  it('gets enabled if app event telepathInProgress is reset', async () => {
    const { getByText, store: { dispatch } } = render(
      <IncreaseContractButton onClick={() => {
        dispatch(AppEventsActions.telepathInProgress())
      }} />
    )

    const button = getByText(/increase/i)
    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    expect(button).toBeDisabled()
    dispatch(AppEventsActions.telepathFulfilled())
    expect(button).not.toBeDisabled()
  })
})
