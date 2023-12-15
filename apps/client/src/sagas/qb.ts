import { put, select, takeEvery } from 'redux-saga/effects'
import QB from '@qc/quickblox'

import * as Types from '../actions'
import { initFailed, initSuccess, loginByToken } from '../actionCreators'
import { authSessionSelector } from '../selectors'
import { stringifyError } from '../utils/parse'

function* init(action: Types.QBInitRequestAction) {
  const { appId, authKey, authSecret, accountKey, config, token } =
    action.payload

  try {
    QB.init(appId, authKey, authSecret, accountKey, config)

    yield put(initSuccess())

    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const sessionToken = token || session?.token

    if (sessionToken) {
      yield put(loginByToken(sessionToken))
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(initFailed(errorMessage))
  }
}

export default [takeEvery(Types.QB_INIT_REQUEST, init)]
