import React from 'react'
import { render } from 'react-testing-library'
import { CogitoQRCode } from './CogitoQRCode'

describe('CogitoQRCode', () => {
  it('shows QR code', () => {
    const value = 'https://url-in-qr.code'
    const { queryByText } = render(<CogitoQRCode value={value} />)

    expect(queryByText(value)).not.toBeNull()
  })
})
