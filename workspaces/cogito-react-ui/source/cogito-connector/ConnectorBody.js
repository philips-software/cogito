import React from 'react'
import { Button, Header } from 'semantic-ui-react'
import {
  Centered,
  Spacer
} from '@react-frontend-developer/react-layout-helpers'
import { CogitoQRCode } from '../CogitoQRCode'

class ConnectorBody extends React.Component {
  componentDidMount () {
    this.subscription = this.props.telepathChannel.subscribeForNotifications(
      notification => {
        if (notification.method === 'didScanQRCode') {
          this.props.onDone()
        }
      }
    )
  }

  componentWillUnmount () {
    this.props.telepathChannel.unsubscribeForNotifications(this.subscription)
  }

  render () {
    const { connectUrl, buttonStyling, onDone } = this.props
    return (
      <Centered>
        <Header>Please scan the QR code below with your mobile device.</Header>
        <Spacer
          margin='20px 0 50px 0'
          render={() =>
            <CogitoQRCode key={connectUrl} connectUrl={connectUrl} />
          } />
        <Button {...buttonStyling} onClick={onDone}>Done</Button>
      </Centered>
    )
  }
}

export { ConnectorBody }
