import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import { identityReducer } from '../identity-manager/reducer'
import devToolsEnhancer from 'remote-redux-devtools'
import logger from 'redux-logger'

function configureAppStore (preloadedState) {
  const middleware = getDefaultMiddleware()
  if (process.env.NODE_ENV === 'development') {
    console.log('add redux logger middleware')
    middleware.push(logger)
  }
  const store = configureStore({
    reducer: { identity: identityReducer },
    middleware,
    preloadedState,
    devTools: false,
    enhancers: [devToolsEnhancer({ realtime: true })]
  })

  // TODO: find out how to do this when you don't have a rootReducer explicitly
  // if (process.env.NODE_ENV === 'development' && module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  // }

  return store
}

const preloadedState = {}
export const store = configureAppStore(preloadedState)
