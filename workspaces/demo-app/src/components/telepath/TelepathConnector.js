import React from 'react'
import QRCode from 'qrcode.react'
import { Button, Header, Modal } from 'semantic-ui-react'
import { Centered, Spacer } from 'components/layout'

class TelepathConnector extends React.Component {
  state

  constructor ({ open = false }) {
    super()
    this.state = {
      open: open
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open !== this.state.open) {
      this.setState({ open: nextProps.open })
    }
  }

  onClick = () => {
    this.setState({open: false})
    this.props.onClosed()
  }

  render () {
    const connectUrl = this.props.channel.createConnectUrl('https://cogito.mobi')
    return (
      <Modal open={this.state.open} trigger={<Button basic color='pink' disabled={this.props.disabled} onClick={() => this.setState({open: true})}>Show QRCode</Button>}>
        <Modal.Header>Scan QRCode</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Centered>
              <Header>Please scan the QRCode below with your mobile device.</Header>
              <Spacer
                margin='20px 0 50px 0'
                render={() =>
                  <QRCode value={connectUrl} />
                } />
              <Button basic color='pink' onClick={() => this.onClick()}>Done</Button>
            </Centered>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export { TelepathConnector }
