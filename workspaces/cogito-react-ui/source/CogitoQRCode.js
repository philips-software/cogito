import React from 'react'
import QRCode from 'qrcode.react'

const CogitoQRCode = ({ connectUrl, title = 'Cogito QR Code' }) => (
  <a href={connectUrl} title={title}>
    <QRCode value={connectUrl} />
  </a>
)

export { CogitoQRCode }
