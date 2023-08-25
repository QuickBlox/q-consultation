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
import i18next from 'i18next'
import { AnyAction } from 'redux'

import * as Types from '../actions'
import {
  logout as logoutRequest,
  logoutFailure,
  logoutSuccess,
  loginError,
  loginSuccess,
  stopCall,
  sessionUpdatedAt,
  uploadFile,
  updateMyAccountSuccess,
  updateMyAccountFailure,
  createAccountSuccess,
  createAccountFailure,
} from '../actionCreators'
import {
  callIsActiveSelector,
  authMyAccountSelector,
  authSessionSelector,
  authLoadingSelector,
} from '../selectors'
import {
  QBLogin,
  QBLogout,
  QBChatDisconnect,
  QBChatConnect,
  QBDeleteContent,
  QBUserUpdate,
  QBUserCreate,
} from '../qb-api-calls'
import { getExpiresDate, isSessionExpired } from '../utils/session'
import { isQBError, stringifyError } from '../utils/parse'
import { userIsProvider } from '../utils/user'

function* emailLoginWatcher(action: Types.QBEmailLoginRequestAction) {
  try {
    const { email, password } = action.payload

    if (!email && !password) {
      throw new Error('Nor email/password, not provider info present')
    }

    const result: { session: QBSession; user: QBUser } = yield call(QBLogin, {
      email,
      password,
    })

    if (userIsProvider(result.user)) {
      yield call(QBLogout)
      throw new Error('Unauthorized')
    } else {
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
      yield put(loginSuccess(result))
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
    yield call(QBChatDisconnect)
    yield call(QBLogout)
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
    yield take(channel)
    const isLoading: ReturnType<typeof authLoadingSelector> = yield select(
      authLoadingSelector,
    )

    if (!isLoading) {
      const session: ReturnType<typeof authSessionSelector> = yield select(
        authSessionSelector,
      )

      if (!session || isSessionExpired(session.updated_at)) {
        yield put(logoutRequest())
      }
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

    const response: { session: QBSession; user: QBUser } = yield call(
      QBUserCreate,
      {
        ...data,
        custom_data: JSON.stringify(data.custom_data),
      },
    )

    const result = createAccountSuccess(response)

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

    if (currentMyAccount) {
      const { then, data: newMyAccount } = action.payload
      const newCustomData = newMyAccount.custom_data
        ? { ...newMyAccount.custom_data }
        : {}

      try {
        if (
          'avatar' in newCustomData &&
          currentMyAccount?.custom_data?.avatar &&
          (!newCustomData.avatar || newCustomData.avatar instanceof File)
        ) {
          yield call(QBDeleteContent, currentMyAccount.custom_data.avatar.id)
        }
      } catch (e) {
        const isNotFound = isQBError(e) && e.code === 404

        if (!isNotFound) {
          throw e
        }
      }

      if (newCustomData?.avatar instanceof File) {
        yield put(uploadFile(newCustomData.avatar))
        const {
          payload: { id, uid },
        }: Types.QBContentUploadSuccessAction = yield take(
          Types.QB_FILE_UPLOAD_SUCCESS,
        )

        newCustomData.avatar = { id, uid }
      }

      const response: SagaReturnType<typeof QBUserUpdate> = yield call(
        QBUserUpdate,
        currentMyAccount.id,
        {
          ...newMyAccount,
          custom_data: JSON.stringify({
            ...currentMyAccount.custom_data,
            ...newCustomData,
          }),
        },
      )
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
  takeEvery(Types.QB_LOGIN_SUCCESS, sessionExpiredFlow),
  takeEvery(Types.LOGOUT_REQUEST, logout),
  takeEvery(Types.QB_MY_ACCOUNT_UPDATE_REQUEST, updateMyAccount),
]
