import React from 'react'
import { render } from 'react-testing-library'
import { CogitoQRCode } from './CogitoQRCode'

describe('CogitoQRCode', () => {
  it('shows QR code', () => {
    const value = 'https://url-in-qr.code'
    const { queryByText } = render(<CogitoQRCode value={value} />)

    expect(queryByText(value)).not.toBeNull()
  })

  it('links to the URL', () => {
    const title = 'Link in QR Code'
    const url = 'https://url-in-qr.code/'
    const { getByTitle } = render(<CogitoQRCode title={title} value={url} />)

    expect(getByTitle(title).href).toEqual(url)
  })
})
