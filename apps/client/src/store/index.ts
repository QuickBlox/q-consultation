import { applyMiddleware, createStore, compose, Store, Middleware } from 'redux'
import persistStore from 'redux-persist/lib/persistStore'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

import rootReducer, { StoreState } from '../reducers'
import { Action } from '../actions'
import * as actionsCreators from '../actionCreators'
import packageInfo from '../../package.json'

const sagaMiddleware = createSagaMiddleware()
const middlewares: Array<Middleware> = [sagaMiddleware]

if (__DEV__ || ENABLE_REDUX_LOGGER) {
  middlewares.push(logger)
}

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionsCreators,
        name: packageInfo.name,
        features: {
          pause: __DEV__,
          lock: __DEV__,
          export: true,
          jump: __DEV__,
          skip: __DEV__,
          reorder: __DEV__,
          dispatch: __DEV__,
        },
      })
    : compose

  const enhancer = composeEnhancers(applyMiddleware(...middlewares))

  const store: Store<StoreState, Action> = createStore(rootReducer, enhancer)
  const persistor = persistStore(store)

  return {
    persistor,
    runSaga: sagaMiddleware.run,
    store,
  }
}
