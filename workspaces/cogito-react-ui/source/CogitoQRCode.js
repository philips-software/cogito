import React from 'react'
import QRCode from 'qrcode.react'

const CogitoQRCode = ({ url, title = 'Cogito QR Code' }) => (
  <a href={url} title={title}>
    <QRCode value={url} />
  </a>
)

export { CogitoQRCode }
