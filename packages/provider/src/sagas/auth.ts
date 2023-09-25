import { EventChannel, eventChannel, SagaIterator, Task } from 'redux-saga'
import {
  actionChannel,
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import i18next from 'i18next'
import { AnyAction } from 'redux'
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
  QBChatConnect,
  QBLogin,
  QBLogout,
  QBChatDisconnect,
} from '../qb-api-calls'
import { authMyAccountSelector, authSessionSelector } from '../selectors'
import { getExpiresDate, isSessionExpired } from '../utils/session'
import { stringifyError } from '../utils/parse'
import { userIsProvider } from '../utils/user'
import { ajax } from './ajax'

function* login(action: Types.QBLoginRequestAction) {
  const { password } = action.payload

  try {
    const result: { session: QBSession; user: QBUser } = yield call(
      QBLogin,
      action.payload,
    )

    if (userIsProvider(result.user)) {
      yield call(QBChatConnect, {
        jid: QB.chat.helpers.getUserJid(result.user.id),
        password: result.session.token,
      })
      const customData: QBUserCustomData = result.user?.custom_data
        ? JSON.parse(result.user.custom_data)
        : {}

      if (customData.language) {
        i18next.changeLanguage(customData.language)
      }
      yield put(
        loginSuccess({
          session: result.session,
          user: { ...result.user, password },
        }),
      )
    } else {
      yield call(QBLogout)
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

    yield call(QBChatDisconnect)
    yield call(QBLogout)
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
    yield take(channel)
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )

    if (!session || isSessionExpired(session.updated_at)) {
      yield put(logoutRequest())
    }
  }
}

function* sessionExpiredFlow(): SagaIterator<void> {
  while (yield take(Types.QB_INIT_SUCCESS)) {
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )

    if (!session) {
      yield take(Types.QB_LOGIN_SUCCESS)
    }
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
      const { then, data: newMyAccount } = action.payload
      const newCustomData = newMyAccount.custom_data
        ? { ...newMyAccount.custom_data }
        : {}

      const url = `${SERVER_APP_URL}/users/provider`
      const form = new FormData()

      if (
        newMyAccount.full_name &&
        newMyAccount.email &&
        newCustomData.profession &&
        newCustomData.description &&
        newCustomData.language
      ) {
        form.append('full_name', newMyAccount.full_name)
        form.append('email', newMyAccount.email)
        form.append('profession', newCustomData.profession)
        form.append('description', newCustomData.description)
        form.append('language', newCustomData.language)
      }

      if (newMyAccount.password && newMyAccount.old_password) {
        form.append('password', newMyAccount.password)
        form.append('old_password', newMyAccount.old_password)
      }

      if (currentMyAccount.custom_data.avatar && !newCustomData.avatar) {
        form.append('avatar', 'none')
      } else if (newCustomData.avatar instanceof File) {
        form.append('avatar', newCustomData.avatar)
      }

      const {
        response,
      }: {
        response: QBUser
      } = yield call(ajax, {
        method: 'PATCH',
        url,
        headers: {
          Authorization: `Bearer ${session!.token}`,
        },
        body: form,
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
