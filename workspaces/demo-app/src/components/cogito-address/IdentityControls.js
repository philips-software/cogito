import React from 'react'
import { Row } from '@react-frontend-developer/react-layout-helpers'

import { ReadIdentityButton } from './ReadIdentityButton'
import { CogitoConnectorButton } from './CogitoConnectorButton'

import { IdentityActions } from './actions'
import { AppEventsActions } from 'app-events'
import { UserDataActions } from 'user-data'

class IdentityControls extends React.Component {
  onOpen = dispatch => {
    const { newChannel } = this.props
    newChannel()
    dispatch(AppEventsActions.setDialogOpen())
  }

  onDone = dispatch => {
    const { telepathChannel: channel } = this.props
    dispatch(IdentityActions.read({ channel }))
    dispatch(AppEventsActions.setDialogClosed())
  }

  onCancel = dispatch => {
    dispatch(UserDataActions.clearConnectionEstablished())
    dispatch(AppEventsActions.setDialogClosed())
  }

  render () {
    const { telepathChannel, newChannel } = this.props
    return (
      <Row css={{ marginTop: '10px' }}>
        <ReadIdentityButton telepathChannel={telepathChannel} />
        <CogitoConnectorButton telepathChannel={telepathChannel}
          newChannel={newChannel}
          onOpen={this.onOpen}
          onDone={this.onDone}
          onCancel={this.onCancel} />
      </Row>
    )
  }
}

export { IdentityControls }
