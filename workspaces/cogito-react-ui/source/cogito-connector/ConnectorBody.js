import React from 'react'
import { Button, Header } from 'semantic-ui-react'
import { Centered, Spacer } from '@react-frontend-developer/react-layout-helpers'
import { CogitoQRCode } from '../CogitoQRCode'

const ConnectorBody = ({ connectUrl, buttonStyling, onDone }) => (
  <Centered>
    <Header>Please scan the QR code below with your mobile device.</Header>
    <Spacer
      margin='20px 0 50px 0'
      render={() =>
        <CogitoQRCode key={connectUrl} url={connectUrl} />
      } />
    <Button {...buttonStyling} onClick={onDone}>Done</Button>
  </Centered>
)

export { ConnectorBody }
