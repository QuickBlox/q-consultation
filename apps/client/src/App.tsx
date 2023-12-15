import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import RootRoute from './screens'
import rootSaga from './sagas'
import createStore from './store'
import './i18n'

const { persistor, runSaga, store } = createStore()

runSaga(rootSaga)

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <RootRoute />
        </Router>
      </PersistGate>
    </Provider>
  )
}
