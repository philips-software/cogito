import React, { Component } from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { Row } from '@react-frontend-developer/react-layout-helpers'
import { IncreaseContractButton } from './IncreaseContractButton'
import { CogitoConnectorButton } from '../cogito-address/CogitoConnectorButton'

import { ContractActions } from './actions'
import { AppEventsActions } from 'app-events'
import { UserDataActions } from 'user-data'

class SimpleStorageControls extends Component {
  state = {
    action: '',
    forceFetchingIdentity: false
  }

  dispatchIncrease = dispatch => {
    const { telepathChannel: channel, simpleStorage } = this.props
    dispatch(
      ContractActions.increase({
        deployedContract: simpleStorage,
        channel,
        increment: 5,
        forceFetchingIdentity: this.state.forceFetchingIdentity
      })
    )
  }

  onOpen = async dispatch => {
    const { newChannel } = this.props
    await newChannel()
    this.setState({ forceFetchingIdentity: true })
    dispatch(AppEventsActions.setDialogOpen())
  }

  onDone = async dispatch => {
    /* istanbul ignore else  */
    if (this.state.action === 'increase') {
      this.dispatchIncrease(dispatch)
    }
    dispatch(AppEventsActions.setDialogClosed())
    this.setState({
      action: ''
    })
  }

  onCancel = dispatch => {
    dispatch(UserDataActions.clearConnectionEstablished())
    dispatch(AppEventsActions.setDialogClosed())
  }

  increase = async (dispatch, channelReady) => {
    if (!channelReady) {
      dispatch(AppEventsActions.setDialogOpen())
      this.setState({
        action: 'increase'
      })
    } else {
      this.dispatchIncrease(dispatch)
      this.setState({ forceFetchingIdentity: false })
    }
  }

  renderWithStore = ({ channelReady }, dispatch) => {
    const { telepathChannel, newChannel } = this.props
    return (
      <Row css={{ marginTop: '10px' }}>
        <IncreaseContractButton onClick={() => this.increase(dispatch, channelReady)} />
        <CogitoConnectorButton telepathChannel={telepathChannel}
          newChannel={newChannel}
          onOpen={this.onOpen}
          onDone={this.onDone}
          onCancel={this.onCancel} />
      </Row>
    )
  }

  select = state => ({
    channelReady: state.userData.connectionEstablished
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

export { SimpleStorageControls }
