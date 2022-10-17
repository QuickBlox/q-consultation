import { applyMiddleware, createStore, compose, Store, Middleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { persistStore } from 'redux-persist'
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync'

import rootReducer, { StoreState } from '../reducers'
import * as Types from '../actions'
import * as actionsCreators from '../actionCreators'
import packageInfo from '../../package.json'

const sagaMiddleware = createSagaMiddleware()
const syncMiddleware = createStateSyncMiddleware({
  whitelist: [
    Types.QB_LOGIN_SUCCESS,
    Types.LOGOUT_SUCCESS,
    Types.QB_MY_ACCOUNT_UPDATE_SUCCESS,
    Types.SESSION_UPDATED_AT,
    Types.QB_INIT_FAILURE,
  ],
})
const middlewares: Array<Middleware> = [sagaMiddleware, syncMiddleware]

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

  const store: Store<StoreState, Types.Action> = createStore(
    rootReducer,
    enhancer,
  )

  initMessageListener(store)

  const persistor = persistStore(store)

  return {
    persistor,
    runSaga: sagaMiddleware.run,
    store,
  }
}
