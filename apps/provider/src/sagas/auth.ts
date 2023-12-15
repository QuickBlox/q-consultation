import { EventChannel, eventChannel, SagaIterator, Task } from 'redux-saga'
import {
  actionChannel,
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  SagaReturnType,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'
import QB, {
  QBUser,
  QBSession,
  QBUserCustomData,
  promisifyCall,
} from '@qc/quickblox'

import i18next from 'i18next'
import { AnyAction } from 'redux'
import translations from '@qc/template/translations'
import * as Types from '../actions'
import {
  logout as logoutRequest,
  logoutFailure,
  logoutSuccess,
  loginError,
  loginSuccess,
  sessionUpdatedAt,
  updateMyAccountFailure,
  updateMyAccountSuccess,
} from '../actionCreators'
import {
  authMyAccountSelector,
  authSessionSelector,
  chatConnectedSelector,
} from '../selectors'
import { getExpiresDate } from '../utils/session'
import { stringifyError } from '../utils/parse'
import { userIsProvider } from '../utils/user'
import { ajax } from './ajax'
import { getLocale } from '../utils/locales'

function* login(action: Types.QBLoginRequestAction) {
  try {
    let session: QBSession

    if ('token' in action.payload) {
      const res: { session: QBSession } = yield promisifyCall(
        QB.startSessionWithToken,
        action.payload.token,
      )

      session = res.session
    } else {
      session = yield promisifyCall(QB.createSession)
    }
    const user: QBUser =
      'token' in action.payload
        ? yield promisifyCall(QB.users.getById, session.user_id)
        : yield promisifyCall(QB.login, action.payload)

    if (userIsProvider(user)) {
      yield promisifyCall(QB.chat.connect, {
        jid: QB.chat.helpers.getUserJid(user.id),
        password: session.token,
      })
      const customData: QBUserCustomData = user?.custom_data
        ? JSON.parse(user.custom_data)
        : {}

      if (customData.language) {
        if (Object.keys(translations).includes(customData.language)) {
          i18next.changeLanguage(customData.language)
        } else {
          i18next.changeLanguage(getLocale())
        }
      }
      yield put(
        loginSuccess({
          session,
          user,
        }),
      )
    } else {
      yield promisifyCall(QB.logout)

      throw new Error('Error: User is not a provider')
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(loginError(errorMessage))
  }
}

export function* logout(action: Types.LogoutRequestAction) {
  try {
    const { then } = action.payload

    QB.chat.disconnect()
    yield promisifyCall(QB.logout)
    const result = logoutSuccess()

    yield put(result)

    if (then) then(result)
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(logoutFailure(errorMessage))
  }
}

function* sessionExpiredWorker(date: Date) {
  const expiresDate = getExpiresDate(date)

  yield delay(expiresDate - Date.now())
  yield put(logoutRequest())
}

/**
 * Updated session after every request
 * Waiting for a session to expire
 * Logout after session expired
 */
function* sessionExpiredApiWatcher() {
  const action: EventChannel<AnyAction> = yield actionChannel(
    Types.API_SUCCESS_ACTIONS,
  )

  while (true) {
    yield take(action)
    const date = new Date()

    yield put(sessionUpdatedAt(date.toISOString()))
    yield race([
      call(sessionExpiredWorker, date),
      take(Types.API_SUCCESS_ACTIONS.concat(Types.LOGOUT_SUCCESS)),
    ])
  }
}

/**
 * Check for session expiration after activating the page
 * Logout if session expired
 */
function* sessionExpiredVisibilityWatcher() {
  const channel = eventChannel((emitter) => {
    const focusHandler = () => {
      emitter('focus')
    }

    window.addEventListener('focus', focusHandler)

    return () => {
      window.removeEventListener('focus', focusHandler)
    }
  })

  while (true) {
    try {
      yield take(channel)
      const connected: SagaReturnType<typeof chatConnectedSelector> =
        yield select(chatConnectedSelector)

      if (connected) {
        const session: QBSession = yield promisifyCall(QB.getSession)

        yield put(sessionUpdatedAt(session.updated_at))
      }
    } catch (e) {
      yield put(logoutRequest())
    }
  }
}

function* sessionExpiredFlow(): SagaIterator<void> {
  while (true) {
    yield take(Types.QB_LOGIN_SUCCESS)
    const expiredApiTask: Task = yield fork(sessionExpiredApiWatcher)
    const expiredVisibilityTask: Task = yield fork(
      sessionExpiredVisibilityWatcher,
    )

    yield take(Types.LOGOUT_SUCCESS)
    yield cancel(expiredApiTask)
    yield cancel(expiredVisibilityTask)
  }
}

function* updateMyAccount(action: Types.QBMyAccountUpdateRequestAction) {
  try {
    const currentMyAccount: ReturnType<typeof authMyAccountSelector> =
      yield select(authMyAccountSelector)
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )

    if (currentMyAccount) {
      const { then, data } = action.payload

      const url = `${SERVER_APP_URL}/users/provider`

      const {
        response,
      }: {
        response: QBUser
      } = yield call(ajax, {
        method: 'PATCH',
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session!.token}`,
        },
        body: JSON.stringify(data),
        responseType: 'json',
      })

      const result = updateMyAccountSuccess(response)

      yield put(result)

      if (then) {
        then(result)
      }
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(updateMyAccountFailure(errorMessage))
  }
}

export default [
  takeEvery(Types.QB_LOGIN_REQUEST, login),
  takeEvery(Types.LOGOUT_REQUEST, logout),
  takeEvery(Types.QB_MY_ACCOUNT_UPDATE_REQUEST, updateMyAccount),
  sessionExpiredFlow(),
]
