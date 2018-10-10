import React from 'react'

import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { CogitoConnector } from '@cogitojs/cogito-react-ui'
import {
  Row,
  Spacer,
  ValueWrapper,
  Centered
} from '@react-frontend-developer/react-layout-helpers'
import { Status } from 'components/styling'
import { TimedStatus } from 'components/utils'
import { Segment, Button } from 'semantic-ui-react'
import { ContractActions } from './actions'
import { AppEventsActions } from 'app-events'

class CogitoContract extends React.Component {
  state = {
    action: '',
    forceRefetchAddress: false
  }

  onTrigger = dispatch => {
    this.setState({ forceRefetchAddress: true })
    dispatch(AppEventsActions.setDialogOpen())
  }

  onClosed = async dispatch => {
    const {
      contracts: { simpleStorage: deployedContract },
      channel
    } = this.props
    if (this.state.action === 'increase') {
      dispatch(
        ContractActions.increase({
          deployedContract,
          channel,
          increment: 5
        })
      )
    } else if (this.state.action === 'read') {
      dispatch(
        ContractActions.read({
          deployedContract,
          channel
        })
      )
    }
    dispatch(AppEventsActions.setDialogClosed())
    this.setState({
      action: ''
    })
  }

  read = async (dispatch, channelReady) => {
    if (!channelReady) {
      dispatch(AppEventsActions.setDialogOpen())
      this.setState({
        action: 'read'
      })
    } else {
      const {
        contracts: { simpleStorage: deployedContract },
        channel
      } = this.props
      dispatch(
        ContractActions.read({
          deployedContract,
          channel,
          forceRefetchAddress: this.state.forceRefetchAddress
        })
      )
      this.setState({ forceRefetchAddress: false })
    }
  }

  increase = async (dispatch, channelReady) => {
    if (!channelReady) {
      dispatch(AppEventsActions.setDialogOpen())
      this.setState({
        action: 'increase'
      })
    } else {
      const {
        contracts: { simpleStorage: deployedContract },
        channel
      } = this.props
      dispatch(
        ContractActions.increase({
          deployedContract,
          channel,
          increment: 5,
          forceRefetchAddress: this.state.forceRefetchAddress
        })
      )
      this.setState({ forceRefetchAddress: false })
    }
  }

  render () {
    return (
      <WithStore
        selector={state => ({
          balance: state.userData.balance,
          channelReady: state.userData.connectionEstablished,
          telepathInProgress: state.appEvents.telepathInProgress,
          telepathError: state.appEvents.telepathError,
          dialogOpen: state.appEvents.dialogOpen
        })}
      >
        {(
          {
            balance,
            channelReady,
            telepathInProgress,
            telepathError,
            dialogOpen
          },
          dispatch
        ) => (
          <Centered>
            <p>Current value is:</p>
            <ValueWrapper>{balance}</ValueWrapper>
            <Row css={{ marginTop: '10px' }}>
              <Button
                secondary
                color='black'
                disabled={telepathInProgress}
                onClick={() => this.read(dispatch, channelReady)}
              >
                Read...
              </Button>
              <Button
                secondary
                color='black'
                disabled={telepathInProgress}
                onClick={() => this.increase(dispatch, channelReady)}
              >
                Increase by 5...
              </Button>
              <CogitoConnector
                open={dialogOpen}
                onTrigger={() => this.onTrigger(dispatch)}
                connectUrl={this.props.channel.createConnectUrl(
                  'https://cogito.mobi'
                )}
                onClosed={() => this.onClosed(dispatch)}
                buttonStyling={{ secondary: true, color: 'black' }}
              />
            </Row>
            {telepathInProgress &&
              <Spacer margin='10px'>
                <Row>
                  <Segment>
                    <Status>Executing contract...</Status>
                  </Segment>
                </Row>
              </Spacer>}
            {telepathError &&
              <TimedStatus
                timeout={3000}
                onTimeout={() =>
                  dispatch(AppEventsActions.telepathErrorClear())}
              >
                <Spacer margin='10px'>
                  <Row>
                    <Segment>
                      <Status>{telepathError}</Status>
                    </Segment>
                  </Row>
                </Spacer>
              </TimedStatus>}
          </Centered>
        )}
      </WithStore>
    )
  }
}

export { CogitoContract }
