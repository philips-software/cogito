import React from 'react'
import glamorous from 'glamorous'
import { Button } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { FullWidth, Centered, ValueWrapper
} from '@react-frontend-developer/react-layout-helpers'
import { AttestationsActions } from 'attestations-state/actions'

export const CogitoAttestations = (props) => (
  <FullWidth>
    <Centered css={{width: '100%'}}>
      <Div>
        <ShowAttestation />
        <RetrieveAttestation {...props} />
      </Div>
    </Centered>
  </FullWidth>
)

const ShowAttestation = () => (
  <Centered css={{padding: '10px', marginRight: '50px', backgroundColor: 'white'}}>
    <p>Scan to add a dummy attestation:</p>
    <QRCode
      value='https://cogito.example.com/attestations/receive#A=email%3Atest.user%40philips.com'
    />
  </Centered>
)

const AttestationsWrapper = glamorous.div({
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center'
})

const Attestations = ({attestations}) => {
  if (attestations.length === 0) {
    return (
      <ValueWrapper>No attestations</ValueWrapper>
    )
  } else {
    return attestations.map((attestation, i) => (
      <AttestationsWrapper key={i}>
        <ValueWrapper>{attestation}</ValueWrapper>
      </AttestationsWrapper>
    ))
  }
}

const RetrieveAttestation = ({ channel }) => (
  <WithStore selector={state => ({ attestations: state.attestations.retrieved })}>
    {
      ({ attestations }, dispatch) =>
        <Centered>
          Your attestations:
          <Attestations attestations={attestations} />
          <Button
            secondary color='black'
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

const Div = glamorous.div({
  width: '100%',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-evenly',
  alignItems: 'center'
})
