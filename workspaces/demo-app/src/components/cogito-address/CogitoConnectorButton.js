import React, { Component } from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { CogitoConnector } from '@cogitojs/cogito-react-ui'

class CogitoConnectorButton extends Component {
  connectUrl = () => {
    const { telepathChannel } = this.props
    return telepathChannel.createConnectUrl(
      'https://cogito.mobi'
    )
  }

  renderWithStore = ({ dialogOpen }, dispatch) => {
    const { onOpen, onDone, onCancel } = this.props
    return (
      <CogitoConnector
        telepathChannel={this.props.telepathChannel}
        buttonStyling={{ secondary: true, color: 'black' }}
        connectUrl={this.connectUrl()}
        open={dialogOpen}
        onOpen={() => onOpen(dispatch)}
        onDone={() => onDone(dispatch)}
        onCancel={() => onCancel(dispatch)}
      />
    )
  }

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
