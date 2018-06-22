import React from 'react'
import glamorous from 'glamorous'
import { Button } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import {
  Centered, DistributedHorizontally, FullWidthCentered, ValueWrapper
} from '@react-frontend-developer/react-layout-helpers'
import { AttestationsActions } from 'attestations-state/actions'

export const CogitoAttestations = (props) => (
  <FullWidthCentered>
    <P>
      Cogito can store attestations, which are claims about your identity.
    </P>
    <Div>
      <DistributedHorizontally>
        <ShowAttestation />
        <RetrieveAttestation {...props} />
      </DistributedHorizontally>
    </Div>
  </FullWidthCentered>
)

const ShowAttestation = () => (
  <Centered css={{padding: '10px', backgroundColor: 'white'}}>
    <p>Scan to add a dummy attestation:</p>
    <QRCode
      value='https://cogito.example.com/attestations/receive#A=email%3Atest.user%40philips.com'
    />
  </Centered>
)

const RetrieveAttestation = ({ channel }) => (
  <WithStore selector={state => ({ attestations: state.attestations.retrieved })}>
    {
      ({ attestations }, dispatch) =>
        <Centered>
          Your attestation is:
          <ValueWrapper>{attestations[0] || 'unknown'}</ValueWrapper>
          <Button
            basic color='pink'
            onClick={() => dispatch(AttestationsActions.retrieve({
              type: 'email',
              telepathChannel: channel
            }))}
          >
            Retrieve
          </Button>
        </Centered>
    }
  </WithStore>
)

const P = glamorous.p({
  maxWidth: '40rem'
})

const Div = glamorous.div({
  width: '40rem'
})
