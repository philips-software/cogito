import React from 'react'
import glamorous from 'glamorous'

import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { CogitoConnector } from '@cogitojs/cogito-react-ui'
import { Row, Spacer, ValueWrapper, FullWidthCentered } from '@react-frontend-developer/react-layout-helpers'
import { Status } from 'components/styling'
import { TimedStatus } from 'components/utils'
import { Segment, Button } from 'semantic-ui-react'
import { ContractActions } from './actions'
import { AppEventsActions } from 'app-events'

const P = glamorous.p({
  maxWidth: '40rem'
})

class CogitoContract extends React.Component {
  state = {
    action: '',
    error: false
  }

  onTrigger = (dispatch) => {
    dispatch(AppEventsActions.setDialogOpen())
  }

  onClosed = async (dispatch) => {
    const { contracts: { simpleStorage: deployedContract }, channel } = this.props
    console.log('action', this.state.action)
    if (this.state.action === 'increase') {
      console.log('will increase contract value...')
      dispatch(ContractActions.increase({
        deployedContract,
        channel,
        increment: 5
      }))
    } else if (this.state.action === 'read') {
      console.log('will read contract value...')
      dispatch(ContractActions.read({
        deployedContract,
        channel
      }))
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
      const { contracts: { simpleStorage: deployedContract }, channel } = this.props
      console.log('will read contract value...')
      dispatch(ContractActions.read({
        deployedContract,
        channel
      }))
    }
  }

  increase = async (dispatch, channelReady) => {
    if (!channelReady) {
      dispatch(AppEventsActions.setDialogOpen())
      this.setState({
        action: 'increase'
      })
    } else {
      const { contracts: { simpleStorage: deployedContract }, channel } = this.props
      console.log('will increase contract value...')
      dispatch(ContractActions.increase({
        deployedContract,
        channel,
        increment: 5
      }))
    }
  }

  render () {
    return (
      <WithStore
        selector={state => ({
          balance: state.userData.balance,
          channelReady: state.userData.connectionEstablished,
          executingContractInProgress: state.appEvents.executingContractInProgress,
          dialogOpen: state.appEvents.dialogOpen
        })}>
        {
          ({ balance, channelReady, executingContractInProgress, dialogOpen }, dispatch) =>
            <FullWidthCentered>
              <P>You have one contract deployed called <span>Simple Storage</span>.</P>
              <P>Simple storage allows you to store a value in a smart contract.</P>
              <P css={{margin: 0}}>Current value is:</P>
              <ValueWrapper>{balance}</ValueWrapper>
              <P>
                Using the buttons below you can read the currently stored value and also increase it.
                When increasing the value stored in the contract, you will need to sign the transaction
                using Cogito identity app. If this is your first transaction, a QR-code will be presented
                that will let you establish a secure connection between the browser and the iOS Cogito App.
                You can always request a new QR-code using the Show QR-code button.
              </P>
              <Row css={{marginTop: '10px'}}>
                <Button basic color='pink' disabled={executingContractInProgress === true}
                  onClick={() => this.read(dispatch, channelReady)}>Read...</Button>
                <Button basic color='pink' disabled={executingContractInProgress === true}
                  onClick={() => this.increase(dispatch, channelReady)}>Increase by 5...</Button>
                <CogitoConnector open={dialogOpen}
                  onTrigger={() => this.onTrigger(dispatch)}
                  connectUrl={this.props.channel.createConnectUrl('https://cogito.mobi')}
                  onClosed={() => this.onClosed(dispatch)}
                  buttonStyling={{basic: true, color: 'pink'}} />
              </Row>
              { executingContractInProgress === true &&
              <Spacer margin='10px'>
                <Row>
                  <Segment>
                    <Status>Executing contract...</Status>
                  </Segment>
                </Row>
              </Spacer>
              }
              { executingContractInProgress === 'error' &&
              <TimedStatus
                timeout={3000}
                onTimeout={() => dispatch(AppEventsActions.executingContractFulfilled())}>
                <Spacer margin='10px'>
                  <Row>
                    <Segment>
                      <Status>Error executing contract</Status>
                    </Segment>
                  </Row>
                </Spacer>
              </TimedStatus>
              }
            </FullWidthCentered>
        }
      </WithStore>
    )
  }
}

export { CogitoContract }
