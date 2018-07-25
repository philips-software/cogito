import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { PageCentered } from '@react-frontend-developer/react-layout-helpers'
import { CogitoReact } from '@cogitojs/cogito-react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'
import { UserDataActions } from 'user-data'

import { Home } from 'pages/home'
import { CogitoId } from 'pages/cogito-id'
import { StreamEncryption } from 'pages/stream-encryption'
import { NoMatch404 } from 'pages/404'

import simpleStorage from 'contracts/SimpleStorage.json'

const contractsInfo = {
  deployedContractsInfo: [
    { contractName: 'simpleStorage', contractDefinition: simpleStorage }
  ],
  rawContractsInfo: []
}

class Main extends React.Component {
  renderComponent = (Component, routeProps, web3Props) => (
    <Component {...web3Props}
      {...routeProps} />
  )

  web3IsReady = ({web3, channel, contracts}) => {
    return (web3 && channel && contracts)
  }

  onTelepathChanged = ({ channelId, channelKey, appName }, dispatch) => {
    dispatch(UserDataActions.setTelepath({ channelId, channelKey, appName }))
  }

  render () {
    return (
      <WithStore
        selector={state => ({
          channelId: state.userData.channelId,
          channelKey: state.userData.channelKey
        })}
        render={({channelId, channelKey}, dispatch) =>
          <CogitoReact contracts={contractsInfo}
            channelId={channelId}
            channelKey={channelKey}
            appName='Cogito Demo App'
            dispatch={dispatch}
            onTelepathChanged={(telepath) => this.onTelepathChanged(telepath, dispatch)}
          >
            {web3Props => {
              if (this.web3IsReady(web3Props)) {
                return (
                  <Switch>
                    <Route exact path='/' render={routeProps => this.renderComponent(Home, routeProps, web3Props)} />
                    <Route exact path='/cogito-id' render={routeProps => this.renderComponent(CogitoId, routeProps, web3Props)} />
                    <Route exact path='/stream-encryption' render={routeProps => this.renderComponent(StreamEncryption, routeProps, web3Props)} />
                    <Route component={NoMatch404} />
                  </Switch>
                )
              } else {
                return (
                  <PageCentered>
                    <div style={{width: '300px', height: '200px'}}>
                      <Segment style={{width: '100%', height: '100%'}}>
                        <Dimmer active inverted>
                          <Loader inverted content={
                            <p>loading web3...</p>
                          } />
                        </Dimmer>
                      </Segment>
                    </div>
                  </PageCentered>
                )
              }
            }}
          </CogitoReact>
        }
      />
    )
  }
}

export { Main }
