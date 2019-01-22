import React from 'react'
import { PropTypes } from 'prop-types'

import { Centered } from '@react-frontend-developer/react-layout-helpers'
import { Identity } from './Identity'
import { IdentityControls } from './IdentityControls'
import { IdentityFeedback } from './IdentityFeedback'

const CogitoAddress = ({ telepathChannel, newChannel }) => (
  <Centered>
    <Identity />
    <IdentityControls telepathChannel={telepathChannel} newChannel={newChannel} />
    <IdentityFeedback />
  </Centered>
)

CogitoAddress.propTypes = {
  telepathChannel: PropTypes.object,
  newChannel: PropTypes.func
}

export { CogitoAddress }
