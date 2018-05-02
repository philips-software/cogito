import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { PageCentered } from 'components/layout'
import { CogitoReact } from '@cogitojs/cogito-react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import { Home } from 'pages/home'
import { NoMatch404 } from 'pages/404'

import simpleStorage from 'contracts/SimpleStorage.json'

const contractsInfo = {
  deployedContractsInfo: [
    { contractName: 'simpleStorage', contractDefinition: simpleStorage }
  ],
  rawContractsInfo: []
}

const renderComponent = (Component, routeProps, web3Props) =>
  <Component {...web3Props}
    {...routeProps} />

const web3IsReady = ({web3, channel, contracts}) => {
  return (web3 && channel && contracts)
}

const Main = () =>
  <WithStore
    selector={state => ({
      channelId: state.userData.channelId,
      channelKey: state.userData.channelKey
    })}
    render={({channelId, channelKey}, dispatch) =>
      <CogitoReact contracts={contractsInfo}
        channelId={channelId}
        channelKey={channelKey}
        dispatch={dispatch}
        render={web3Props => {
          if (web3IsReady(web3Props)) {
            return (
              <Switch>
                <Route exact path='/' render={routeProps => renderComponent(Home, routeProps, web3Props)} />
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
      />
    }
  />

export { Main }
