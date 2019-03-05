import React from 'react'
import { render } from 'react-testing-library'
import { CogitoQRCode } from './CogitoQRCode'

describe('CogitoQRCode', () => {
  const title = 'Link in QR Code'
  const url = 'https://url-in-qr.code/'

  it('shows QR code', () => {
    const { queryByText } = render(<CogitoQRCode url={url} />)

    expect(queryByText(url)).not.toBeNull()
  })

  it('links to the URL', () => {
    const { getByTitle } = render(<CogitoQRCode title={title} url={url} />)

    expect(getByTitle(title).href).toEqual(url)
  })
})
