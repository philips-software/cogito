import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'

import { IdentityActions } from './actions'
import { AppEventsActions } from 'app-events'

class ReadIdentityButton extends Component {
  read = async (dispatch, channelReady) => {
    if (!channelReady) {
      dispatch(AppEventsActions.setDialogOpen())
    } else {
      const { telepathChannel: channel } = this.props
      dispatch(IdentityActions.read({ channel }))
    }
  }

  renderWithStore = ({ telepathInProgress, channelReady }, dispatch) => (
    <Button
      secondary
      color='black'
      disabled={telepathInProgress}
      onClick={() => this.read(dispatch, channelReady)}
    >
      Read your identity...
    </Button>
  )

  select = state => ({
    channelReady: state.userData.connectionEstablished,
    telepathInProgress: state.appEvents.telepathInProgress
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

export { ReadIdentityButton }
