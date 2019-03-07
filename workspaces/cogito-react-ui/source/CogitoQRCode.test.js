import React from 'react'
import { render } from 'react-testing-library'
import { CogitoQRCode } from './CogitoQRCode'

describe('CogitoQRCode', () => {
  const title = 'Link in QR Code'
  const connectUrl = 'https://url-in-qr.code/'

  it('shows QR code', () => {
    const { queryByText } = render(<CogitoQRCode connectUrl={connectUrl} />)

    expect(queryByText(connectUrl)).not.toBeNull()
  })

  it('links to the URL', () => {
    const { getByTitle } = render(<CogitoQRCode title={title} connectUrl={connectUrl} />)

    expect(getByTitle(title).href).toEqual(connectUrl)
  })
})
