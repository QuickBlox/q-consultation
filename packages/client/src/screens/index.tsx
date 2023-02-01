import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { init } from '../actionCreators'
import { useActions, useQuery } from '../hooks'
import AuthScreen from './AuthScreen'
import RootScreen from './RootScreen'
import {
  authMyAccountSelector,
  qbReadySelector,
  qbLoadingSelector,
  authHasSessionSelector,
  qbErrorSelector,
} from '../selectors'
import Modal from '../components/Modal'
import WaitingForNetwork from '../modules/WaitingForNetwork'
import { createMapStateSelector } from '../utils/selectors'
import LanguageModal from '../modules/modals/LanguageModal'
import Loader from '../components/Loader'
import Header from '../modules/Header'
import Sound from '../modules/Sound'

const selector = createMapStateSelector({
  ready: qbReadySelector,
  loading: qbLoadingSelector,
  hasSession: authHasSessionSelector,
  myAccount: authMyAccountSelector,
  qbError: qbErrorSelector,
})

export default function RootRoute() {
  const { ready, loading, hasSession, myAccount, qbError } =
    useSelector(selector)
  const actions = useActions({ init })
  const { token } = useQuery()

  useEffect(() => {
    if (!ready && !loading) {
      const config: QBConfig = {
        debug: __DEV__ || QB_SDK_CONFIG_DEBUG,
        endpoints: {},
        webrtc: {},
      }

      if (QB_SDK_CONFIG_ENDPOINT_API) {
        config.endpoints.api = QB_SDK_CONFIG_ENDPOINT_API
      }

      if (QB_SDK_CONFIG_ENDPOINT_CHAT) {
        config.endpoints.chat = QB_SDK_CONFIG_ENDPOINT_CHAT
      }

      if (QB_SDK_CONFIG_ICE_SERVERS.length) {
        config.webrtc.iceServers = QB_SDK_CONFIG_ICE_SERVERS
      }

      if (token && !qbError) {
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
  }, [ready, loading, token, qbError])

  if (!ready && !qbError) {
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
      {hasSession && myAccount ? <RootScreen /> : <AuthScreen />}
      <Sound />
      <Modal>
        <LanguageModal />
      </Modal>
    </>
  )
}
