import React from 'react'
import { Row } from '@react-frontend-developer/react-layout-helpers'

import { ReadIdentityButton } from './ReadIdentityButton'
import { CogitoConnectorButton } from './CogitoConnectorButton'

const IdentityControls = ({ telepathChannel, newChannel }) => (
  <Row css={{ marginTop: '10px' }}>
    <ReadIdentityButton telepathChannel={telepathChannel} />
    <CogitoConnectorButton telepathChannel={telepathChannel} newChannel={newChannel} />
  </Row>
)

export { IdentityControls }
