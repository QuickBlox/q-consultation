import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { QBConfig } from '@qc/quickblox'

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
  authLoggedInSelector,
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
  loggedIn: authLoggedInSelector,
  hasSession: authHasSessionSelector,
  myAccount: authMyAccountSelector,
  qbError: qbErrorSelector,
})

export default function RootRoute() {
  const { ready, loading, loggedIn, hasSession, myAccount, qbError } =
    useSelector(selector)
  const actions = useActions({ init })
  const { token } = useQuery()

  useEffect(() => {
    if (!ready && !loading) {
      const config: QBConfig = {
        debug: __DEV__ || QB_SDK_CONFIG_DEBUG,
        endpoints: {
          api: QB_SDK_CONFIG_ENDPOINT_API,
          chat: QB_SDK_CONFIG_ENDPOINT_CHAT,
        },
        webrtc: {
          iceServers: QB_SDK_CONFIG_ICE_SERVERS as any,
        },
      }

      actions.init({
        appId: QB_SDK_CONFIG_APP_ID,
        authKey: QB_SDK_CONFIG_AUTH_KEY,
        authSecret: QB_SDK_CONFIG_AUTH_SECRET,
        accountKey: QB_SDK_CONFIG_ACCOUNT_KEY,
        config,
        token,
      })
    }
  }, [ready, loading, token, qbError])

  if (!ready || (hasSession && !loggedIn)) {
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
      <Modal>{HAS_CHANGE_LANGUAGE && <LanguageModal />}</Modal>
    </>
  )
}
