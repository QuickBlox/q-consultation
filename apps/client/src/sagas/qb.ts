import { call, put, select, take, takeEvery } from 'redux-saga/effects'

import i18next from 'i18next'
import * as Types from '../actions'
import {
  emailLogin,
  initFailed,
  initSuccess,
  loginSuccess,
  logoutSuccess,
} from '../actionCreators'
import { QBInit, QBGetSession, QBUserGet, QBChatConnect } from '../qb-api-calls'
import { isSessionExpired } from '../utils/session'
import { authMyAccountSelector, authSessionSelector } from '../selectors'
import { stringifyError } from '../utils/parse'

function* init(action: Types.QBInitRequestAction) {
  const { appIdOrToken, authKeyOrAppId, authSecret, accountKey, config } =
    action.payload
  const session: ReturnType<typeof authSessionSelector> = yield select(
    authSessionSelector,
  )
  const user: ReturnType<typeof authMyAccountSelector> = yield select(
    authMyAccountSelector,
  )

  try {
    if (session && typeof appIdOrToken === 'number') {
      yield call(QBInit, {
        appIdOrToken: session.token,
        authKeyOrAppId: appIdOrToken,
        authSecret: undefined,
        accountKey,
        config,
      })
    } else {
      yield call(QBInit, {
        appIdOrToken,
        authKeyOrAppId,
        authSecret,
        accountKey,
        config,
      })
    }
    const initViaToken =
      typeof appIdOrToken === 'string' &&
      typeof authKeyOrAppId === 'number' &&
      typeof authSecret === 'undefined'

    if (session || initViaToken) {
      // check if token is valid and there is a session on server
      const remoteSession: QBSession = yield call(QBGetSession)

      if (user && isSessionExpired(remoteSession.updated_at)) {
        if (user.password) {
          yield put(emailLogin({ email: user.email, password: user.password }))
          yield take(Types.QB_LOGIN_SUCCESS)
        } else {
          yield put(logoutSuccess())
        }
      } else {
        const usersResponse: QBUser = yield call(
          QBUserGet,
          remoteSession.user_id,
        )

        yield call(QBChatConnect, {
          jid: QB.chat.helpers.getUserJid(usersResponse.id),
          password: remoteSession.token,
        })
        const customData: QBUserCustomData = usersResponse?.custom_data
          ? JSON.parse(usersResponse.custom_data)
          : {}

        if (customData.language) {
          i18next.changeLanguage(customData.language)
        }
        yield put(
          loginSuccess({
            session: remoteSession,
            user: usersResponse,
          }),
        )
      }
    }
    yield put(initSuccess())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(initFailed(errorMessage))
  }
}

export default [takeEvery(Types.QB_INIT_REQUEST, init)]
