import React from 'react'
import { render, wait } from 'test-helpers/render-props'
import { UserDataActions } from 'user-data'
import { Balance } from './Balance'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('Balance', () => {
  const value = 100

  it('has description of the balance value', () => {
    const { getByText } = render(<Balance />)
    expect(getByText(/current value is/i)).toBeInTheDocument()
  })

  it('displays balance as stored in the userData global state', () => {
    const { getByTestId } = render(<Balance />)
    expect(getByTestId(/current-value/i)).toHaveTextContent('0')
  })

  it('updates balance when balance in userData change', async () => {
    const { getByTestId, store: { dispatch } } = render(<Balance />)
    dispatch(UserDataActions.setBalance(value))
    await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${value}`))
  })
})
