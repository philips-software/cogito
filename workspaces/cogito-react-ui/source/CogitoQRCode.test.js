import React from 'react'
import { render } from 'react-testing-library'
import { CogitoQRCode } from './CogitoQRCode'

describe('CogitoQRCode', () => {
  const defaultTitle = 'Cogito QR Code'
  const title = 'Link in QR Code'
  const connectUrl = 'https://url-in-qr.code/'

  it('shows QR code with default title', () => {
    const { queryByText, queryByTitle } = render(<CogitoQRCode connectUrl={connectUrl} />)

    expect(queryByText(connectUrl)).not.toBeNull()
    expect(queryByTitle(defaultTitle).href).not.toBeNull()
  })

  it('links to the URL', () => {
    const { getByTitle } = render(<CogitoQRCode title={title} connectUrl={connectUrl} />)

    expect(getByTitle(title).href).toEqual(connectUrl)
  })
})
