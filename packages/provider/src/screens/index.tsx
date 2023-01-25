import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import { LOGIN_ROUTE, ROOT_ROUTE } from '../constants/routes'
import LoginScreen from './LoginScreen'
import RootScreen from './RootScreen'
import WaitingForNetwork from '../modules/WaitingForNetwork'
import {
  authHasSessionSelector,
  authMyAccountSelector,
  qbReadySelector,
  qbLoadingSelector,
} from '../selectors'
import Modal from '../components/Modal'
import LanguageModal from '../modules/modals/LanguageModal'
import Sound from '../modules/Sound'
import { init } from '../actionCreators'
import { useActions, useQuery } from '../hooks'
import { createMapStateSelector } from '../utils/selectors'
import Loader from '../components/Loader'
import Header from '../modules/Header'

const selector = createMapStateSelector({
  ready: qbReadySelector,
  loading: qbLoadingSelector,
  hasSession: authHasSessionSelector,
  myAccount: authMyAccountSelector,
})

export default function RootRoute() {
  const { ready, loading, hasSession, myAccount } = useSelector(selector)
  const actions = useActions({ init })
  const { token } = useQuery()

  useEffect(() => {
    if (!ready && !loading) {
      const config: QBConfig = {
        debug: __DEV__ || QB_SDK_CONFIG_DEBUG,
        endpoints: {},
        webrtc: {},
      }

      if (QB_SDK_CONFIG_ENDPOINTS_API) {
        config.endpoints.api = QB_SDK_CONFIG_ENDPOINTS_API
      }

      if (QB_SDK_CONFIG_ENDPOINTS_CHAT) {
        config.endpoints.chat = QB_SDK_CONFIG_ENDPOINTS_CHAT
      }

      if (QB_SDK_CONFIG_ICE_SERVERS.length) {
        config.webrtc.iceServers = QB_SDK_CONFIG_ICE_SERVERS
      }

      if (token) {
        actions.init({
          appIdOrToken: token,
          authKeyOrAppId: QB_SDK_CONFIG_APP_ID,
          authSecret: undefined,
          accountKey: QB_SDK_CONFIG_ACCOUNT_KEY,
          config,
        })
      } else {
        actions.init({
          appIdOrToken: QB_SDK_CONFIG_APP_ID,
          authKeyOrAppId: QB_SDK_CONFIG_AUTH_KEY,
          authSecret: QB_SDK_CONFIG_AUTH_SECRET,
          accountKey: QB_SDK_CONFIG_ACCOUNT_KEY,
          config,
        })
      }
    }
  }, [ready, loading, token])

  if (!ready) {
    return (
      <>
        <Header />
        <div className="loading-content">
          <Loader theme="primary" size={22} />
        </div>
      </>
    )
  }

  return (
    <>
      <WaitingForNetwork />
      <Switch>
        {hasSession && myAccount ? (
          <Route path={ROOT_ROUTE} component={RootScreen} />
        ) : (
          <Route path={LOGIN_ROUTE} component={LoginScreen} />
        )}
        <Redirect to={hasSession && myAccount ? ROOT_ROUTE : LOGIN_ROUTE} />
      </Switch>
      <Sound />
      <Modal>
        <LanguageModal />
      </Modal>
    </>
  )
}
