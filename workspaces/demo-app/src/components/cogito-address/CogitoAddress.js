import React from 'react'
import { Button } from 'semantic-ui-react'

import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import {
  Centered,
  ValueWrapper,
  Spacer,
  Row
} from '@react-frontend-developer/react-layout-helpers'

import { CogitoConnector } from '@cogitojs/cogito-react-ui'
import { IdentityActions } from './actions'
import { AppEventsActions } from 'app-events'
import { TelepathError, TelepathStatus } from 'components/telepath'

class CogitoAddress extends React.PureComponent {
  onTrigger = dispatch => {
    const { newChannel } = this.props
    newChannel()
    dispatch(AppEventsActions.setDialogOpen())
  }

  onClosed = async dispatch => {
    const { telepathChannel: channel } = this.props

    dispatch(IdentityActions.read({ channel }))
    dispatch(AppEventsActions.setDialogClosed())
  }

  read = async (dispatch, channelReady) => {
    if (!channelReady) {
      dispatch(AppEventsActions.setDialogOpen())
    } else {
      const { telepathChannel: channel } = this.props
      dispatch(IdentityActions.read({ channel }))
    }
  }

  render () {
    return (
      <WithStore
        selector={state => ({
          address: state.userData.ethereumAddress,
          username: state.userData.username,
          channelReady: state.userData.connectionEstablished,
          telepathInProgress: state.appEvents.telepathInProgress,
          telepathError: state.appEvents.telepathError,
          dialogOpen: state.appEvents.dialogOpen
        })}
      >
        {(
          {
            address,
            username,
            channelReady,
            telepathInProgress,
            telepathError,
            dialogOpen
          },
          dispatch
        ) => (
          <Centered>
            <p>Your Cogito account address is:</p>
            <ValueWrapper>{address || 'unknown'}</ValueWrapper>
            <Spacer margin='20px 0 0 0' />
            <p>You are known as:</p>
            <ValueWrapper>{username || 'unknown'}</ValueWrapper>
            <Row css={{ marginTop: '10px' }}>
              <Button
                secondary
                color='black'
                disabled={telepathInProgress}
                onClick={() => this.read(dispatch, channelReady)}
              >
                Read your identity...
              </Button>
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

export { CogitoAddress }
