import React, { Component } from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { CogitoConnector } from '@cogitojs/cogito-react-ui'

import { IdentityActions } from './actions'
import { AppEventsActions } from 'app-events'
import { UserDataActions } from 'user-data'

class CogitoConnectorButton extends Component {
  onOpen = dispatch => {
    const { newChannel } = this.props
    newChannel()
    dispatch(AppEventsActions.setDialogOpen())
  }

  onClosed = dispatch => {
    const { telepathChannel: channel } = this.props
    dispatch(IdentityActions.read({ channel }))
    dispatch(AppEventsActions.setDialogClosed())
  }

  onCancel = dispatch => {
    dispatch(UserDataActions.clearConnectionEstablished())
    dispatch(AppEventsActions.setDialogClosed())
  }

  connectUrl = () => {
    const { telepathChannel } = this.props
    return telepathChannel.createConnectUrl(
      'https://cogito.mobi'
    )
  }

  renderWithStore = ({ dialogOpen }, dispatch) => (
    <CogitoConnector
      buttonStyling={{ secondary: true, color: 'black' }}
      connectUrl={this.connectUrl()}
      open={dialogOpen}
      onOpen={() => this.onOpen(dispatch)}
      onDone={() => this.onClosed(dispatch)}
      onCancel={() => this.onCancel(dispatch)}
    />
  )

  select = state => ({
    dialogOpen: state.appEvents.dialogOpen
  })

  render () {
    return (
      <WithStore
        selector={this.select}
        render={this.renderWithStore}
      />
    )
  }
}

export { CogitoConnectorButton }
