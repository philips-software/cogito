import React from 'react'
import QRCode from 'qrcode.react'
import { Button, Header, Modal } from 'semantic-ui-react'
import { Centered, Spacer } from '@react-frontend-developer/react-layout-helpers'

class CogitoConnector extends React.Component {
  state

  constructor ({ open = false }) {
    super()
    this.state = {
      open: open
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.open !== prevState.open) {
      return { open: nextProps.open }
    }
    return null
  }

  onClick = () => {
    this.setState({open: false})
    this.props.onClosed()
  }

  render () {
    return (
      <Modal open={this.state.open}
        trigger={
          <Button {...this.props.buttonStyling}
            disabled={this.props.disabled}
            onClick={() => this.setState({open: true})}>
            {this.props.triggerButtonText || 'Show QRCode'}
          </Button>
        }>
        <Modal.Header>Scan QRCode</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Centered>
              <Header>Please scan the QRCode below with your mobile device.</Header>
              <Spacer
                margin='20px 0 50px 0'
                render={() =>
                  <QRCode value={this.props.connectUrl} />
                } />
              <Button {...this.props.buttonStyling} onClick={() => this.onClick()}>Done</Button>
            </Centered>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export { CogitoConnector }
