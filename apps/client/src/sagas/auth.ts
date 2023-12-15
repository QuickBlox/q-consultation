import { EventChannel, eventChannel, Task } from 'redux-saga'
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
  promisifyCall,
  QBSession,
  QBUser,
  QBUserCustomData,
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
  stopCall,
  sessionUpdatedAt,
  updateMyAccountSuccess,
  updateMyAccountFailure,
  createAccountSuccess,
  createAccountFailure,
  loginByTokenSuccess,
  loginByTokenError,
} from '../actionCreators'
import {
  callIsActiveSelector,
  authMyAccountSelector,
  authLoadingSelector,
  chatConnectedSelector,
  authSessionSelector,
} from '../selectors'
import { getExpiresDate } from '../utils/session'
import { stringifyError } from '../utils/parse'
import { userIsProvider } from '../utils/user'
import { getLocale } from '../utils/locales'
import { ajax } from './ajax'

function* loginByToken(action: Types.QBLoginByTokenRequestAction) {
  try {
    const { session }: { session: QBSession } = yield promisifyCall(
      QB.startSessionWithToken,
      action.payload.token,
    )
    const user: QBUser = yield promisifyCall(QB.users.getById, session.user_id)

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
    yield put(loginByTokenSuccess({ session, user }))
  } catch (e) {
    const errorMessage = stringifyError(e).includes('base')
      ? stringifyError(e).replace('base', '').trim()
      : stringifyError(e)

    yield put(loginByTokenError(errorMessage))
  }
}

function* emailLoginWatcher(action: Types.QBEmailLoginRequestAction) {
  try {
    const { email, password } = action.payload

    if (!email && !password) {
      throw new Error('Nor email/password, not provider info present')
    }

    const session: QBSession = yield promisifyCall(QB.createSession)
    const user: QBUser = yield promisifyCall(QB.login, {
      email,
      password,
    })

    if (userIsProvider(user)) {
      yield promisifyCall(QB.logout)
      throw new Error('Unauthorized')
    } else {
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
      yield put(loginSuccess({ session, user }))
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(loginError(errorMessage))
  }
}

export function* logout(action: Types.LogoutRequestAction) {
  try {
    const { then } = action.payload
    const onCall: ReturnType<typeof callIsActiveSelector> = yield select(
      callIsActiveSelector,
    )

    if (onCall) {
      yield put(stopCall())
    }

    QB.chat.disconnect()
    yield promisifyCall(QB.logout)
    const result = logoutSuccess()

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(logoutFailure(errorMessage))
  }
}

function* sessionExpiredWorker(date: Date) {
  const expiresDate = getExpiresDate(date)

  yield delay(expiresDate - Date.now())
  const isLoading: ReturnType<typeof authLoadingSelector> = yield select(
    authLoadingSelector,
  )

  if (!isLoading) {
    yield put(logoutRequest())
  }
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

export function* sessionExpiredFlow() {
  const expiredApiTask: Task = yield fork(sessionExpiredApiWatcher)
  const expiredVisibilityTask: Task = yield fork(
    sessionExpiredVisibilityWatcher,
  )

  yield take(Types.LOGOUT_SUCCESS)
  yield cancel(expiredApiTask)
  yield cancel(expiredVisibilityTask)
}

function* createAccount(action: Types.QBAccountCreateRequestAction) {
  try {
    const { then, data } = action.payload

    const session: QBSession = yield promisifyCall(QB.createSession)
    const user: QBUser = yield promisifyCall(QB.users.create, {
      ...data,
      custom_data: JSON.stringify(data.custom_data),
    })

    const result = createAccountSuccess({ session, user })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(createAccountFailure(errorMessage))
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

      const url = `${SERVER_APP_URL}/users/client`

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
  takeEvery(Types.QB_LOGIN_REQUEST, emailLoginWatcher),
  takeEvery(Types.QB_ACCOUNT_CREATE_REQUEST, createAccount),
  takeEvery(Types.QB_LOGIN_BY_TOKEN_REQUEST, loginByToken),
  takeEvery(
    [Types.QB_LOGIN_SUCCESS, Types.QB_LOGIN_BY_TOKEN_SUCCESS],
    sessionExpiredFlow,
  ),
  takeEvery(Types.LOGOUT_REQUEST, logout),
  takeEvery(Types.QB_MY_ACCOUNT_UPDATE_REQUEST, updateMyAccount),
]
