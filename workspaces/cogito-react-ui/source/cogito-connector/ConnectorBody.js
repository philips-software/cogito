import React from 'react'
import { Header } from 'semantic-ui-react'
import {
  Centered,
  Spacer
} from '@react-frontend-developer/react-layout-helpers'
import { CogitoQRCode } from '../CogitoQRCode'

class ConnectorBody extends React.Component {
  componentDidMount () {
    const { telepathChannel, onDone } = this.props
    this.subscription = telepathChannel.subscribeForNotifications(
      notification => {
        if (notification.method === 'connectionSetupDone') {
          telepathChannel.unsubscribeForNotifications(this.subscription)
          onDone()
        }
      }
    )
  }

  componentWillUnmount () {
    const { telepathChannel } = this.props
    telepathChannel.unsubscribeForNotifications(this.subscription)
  }

  render () {
    const { connectUrl } = this.props
    return (
      <Centered>
        <Header>Please scan the QR code below with your mobile device.</Header>
        <Spacer
          margin='20px 0 50px 0'
          render={() => <CogitoQRCode key={connectUrl} connectUrl={connectUrl} />}
        />
      </Centered>
    )
  }
}
export { ConnectorBody }
