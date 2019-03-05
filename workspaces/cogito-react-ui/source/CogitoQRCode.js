import React from 'react'
import QRCode from 'qrcode.react'

class CogitoQRCode extends React.Component {
  state = {}

  componentDidMount () {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      this.setState({
        canvas: {
          url: canvas.toDataURL(),
          width: canvas.width / 2,
          height: canvas.height / 2
        }
      })
    }
  }

  render () {
    const { canvas } = this.state
    return (
      <a href={this.props.value} title={this.props.title}>
        { !canvas && <QRCode
          value={this.props.value}
        /> }
        { canvas && <img alt='qr-code' src={canvas.url} width={canvas.width} height={canvas.height} /> }
      </a>
    )
  }
}

export { CogitoQRCode }
