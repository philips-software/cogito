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
import { Segment, Button } from 'semantic-ui-react'
import { ContractActions } from './actions'
import { AppEventsActions } from 'app-events'
import { TelepathError } from '../telepath/TelepathError'
import { BalanceWatcher } from './BalanceWatcher'

class CogitoContract extends React.Component {
  state = {
    action: '',
    forceFetchingIdentity: false
  }

  onTrigger = dispatch => {
    this.setState({ forceFetchingIdentity: true })
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
    }
    dispatch(AppEventsActions.setDialogClosed())
    this.setState({
      action: ''
    })
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
          forceFetchingIdentity: this.state.forceFetchingIdentity
        })
      )
      this.setState({ forceFetchingIdentity: false })
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
            <BalanceWatcher dispatch={dispatch} contracts={this.props.contracts} />
            <p>Current value is:</p>
            <ValueWrapper data-testid='current-value'>{balance}</ValueWrapper>
            <Row css={{ marginTop: '10px' }}>
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
            <TelepathError
              error={telepathError}
              onTimeout={() => dispatch(AppEventsActions.telepathErrorClear())}
            />
          </Centered>
        )}
      </WithStore>
    )
  }
}

export { CogitoContract }
