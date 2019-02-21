import React from 'react'
import { render } from 'react-testing-library'
import { CogitoConnector } from './CogitoConnector'

describe('Cogito Connector', () => {
  it('does not show the dialog initially', () => {
    const { queryByText } = render(<CogitoConnector connectUrl='connectUrl' />)
    expect(queryByText(/scan the qr code/i)).toBeNull()
  })

  it('does show the dialog when opened', () => {
    const { queryByText } = render(<CogitoConnector open connectUrl='connectUrl' />)
    expect(queryByText(/scan the qr code/i)).not.toBeNull()
  })
})
