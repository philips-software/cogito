import React from 'react'

import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { CogitoConnector } from '@cogitojs/cogito-react-ui'
import {
  Row,
  Centered
} from '@react-frontend-developer/react-layout-helpers'
import { ContractActions } from './actions'
import { AppEventsActions } from 'app-events'
import { BalanceWatcher } from './BalanceWatcher'
import { Balance } from './Balance'
import { IncreaseContractButton } from './IncreaseContractButton'
import { TelepathError, TelepathStatus } from 'components/telepath'
import { PropTypes } from 'prop-types'

class CogitoContract extends React.Component {
  static propTypes = {
    telepathChannel: PropTypes.object,
    SimpleStorage: PropTypes.func,
    newChannel: PropTypes.func
  }

  state = {
    action: '',
    forceFetchingIdentity: false
  }

  onTrigger = dispatch => {
    this.props.newChannel()
    this.setState({ forceFetchingIdentity: true })
    dispatch(AppEventsActions.setDialogOpen())
  }

  dispatchIncrease = dispatch => {
    const { telepathChannel: channel } = this.props
    dispatch(
      ContractActions.increase({
        deployedContract: this.state.simpleStorage,
        channel,
        increment: 5,
        forceFetchingIdentity: this.state.forceFetchingIdentity
      })
    )
  }

  onClosed = async dispatch => {
    /* istanbul ignore else  */
    if (this.state.action === 'increase') {
      this.dispatchIncrease(dispatch)
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
      this.dispatchIncrease(dispatch)
      this.setState({ forceFetchingIdentity: false })
    }
  }

  async componentDidMount () {
    const { SimpleStorage } = this.props
    const simpleStorage = await SimpleStorage.deployed()
    this.setState({ simpleStorage })
  }

  render () {
    if (!this.state.simpleStorage) return null
    return (
      <WithStore
        selector={state => ({
          channelReady: state.userData.connectionEstablished,
          telepathInProgress: state.appEvents.telepathInProgress,
          telepathError: state.appEvents.telepathError,
          dialogOpen: state.appEvents.dialogOpen
        })}
      >
        {(
          {
            channelReady,
            telepathInProgress,
            telepathError,
            dialogOpen
          },
          dispatch
        ) => (
          <Centered>
            <BalanceWatcher dispatch={dispatch} simpleStorage={this.state.simpleStorage} />
            <Balance />
            <Row css={{ marginTop: '10px' }}>
              <IncreaseContractButton onClick={() => this.increase(dispatch, channelReady)} />
              <CogitoConnector
                open={dialogOpen}
                onTrigger={() => this.onTrigger(dispatch)}
                connectUrl={this.props.telepathChannel.createConnectUrl(
                  'https://cogito.mobi'
                )}
                onClosed={() => this.onClosed(dispatch)}
                buttonStyling={{ secondary: true, color: 'black' }}
              />
            </Row>
            <TelepathStatus>Executing contract...</TelepathStatus>
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
