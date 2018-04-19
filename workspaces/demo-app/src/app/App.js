import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { PageCentered } from 'components/layout'
import { Provider } from 'react-redux'
import { ReactWeb3 } from 'components/web3'
import { store, WithStore } from 'app-state'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import { Home } from 'pages/home'
import { NoMatch404 } from 'pages/404'

const renderComponent = (Component, routeProps, web3Props) =>
  <Component {...web3Props}
    {...routeProps} />

const web3IsReady = ({web3, channel, contracts}) => {
  return (web3 && channel && contracts)
}

const App = () =>
  <Provider store={store}>
    <Router>
      <WithStore
        selector={state => ({
          channelId: state.userData.channelId,
          channelKey: state.userData.channelKey
        })}
        render={({channelId, channelKey}, dispatch) =>
          <ReactWeb3 channelId={channelId}
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
    </Router>
  </Provider>

export { App }
