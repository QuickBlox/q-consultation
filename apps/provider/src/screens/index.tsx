import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom'

import { QBConfig } from '@qc/quickblox'
import { LOGIN_ROUTE } from '../constants/routes'
import LoginScreen from './LoginScreen'
import RootScreen from './RootScreen'
import WaitingForNetwork from '../modules/WaitingForNetwork'
import {
  authHasSessionSelector,
  authMyAccountSelector,
  qbReadySelector,
  qbLoadingSelector,
  authLoggedInSelector,
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
  loggedIn: authLoggedInSelector,
  hasSession: authHasSessionSelector,
  myAccount: authMyAccountSelector,
})

export default function RootRoute() {
  const { ready, loading, loggedIn, hasSession, myAccount } =
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
  }, [ready, loading, token])

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
      {hasSession && myAccount ? (
        <RootScreen />
      ) : (
        <Routes>
          <Route path={LOGIN_ROUTE} element={<LoginScreen />} />
          <Route path="*" element={<Navigate to={LOGIN_ROUTE} replace />} />
        </Routes>
      )}
      <Sound />
      <Modal>{HAS_CHANGE_LANGUAGE && <LanguageModal />}</Modal>
    </>
  )
}
