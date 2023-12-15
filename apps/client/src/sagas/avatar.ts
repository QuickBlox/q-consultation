import { call, put, select, takeLatest } from 'redux-saga/effects'

import * as Types from '../actions'
import {
  getUserAvatarSuccess,
  getUserAvatarFailure,
  getMyAvatarSuccess,
  getMyAvatarFailure,
  setMyAvatarSuccess,
  setMyAvatarFailure,
  deleteMyAvatarSuccess,
  deleteMyAvatarFailure,
} from '../actionCreators'
import { stringifyError } from '../utils/parse'
import { takeEveryQueue } from '../utils/saga'
import { authSessionSelector } from '../selectors'
import { ajax } from './ajax'

function* getUserAvatar(action: Types.GetUserAvatarRequestAction) {
  const { userId, then } = action.payload

  try {
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/users/${userId}/avatar`

    const {
      response,
    }: {
      response: Blob
    } = yield call(ajax, {
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${session!.token}`,
      },
      responseType: 'blob',
    })
    const result = getUserAvatarSuccess({
      userId,
      blob: response,
    })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)
    const result = getUserAvatarFailure(userId, errorMessage)

    yield put(result)

    if (then) {
      then(result)
    }
  }
}

function* getMyAvatar(action: Types.GetMyAvatarRequestAction) {
  const { then } = action.payload

  try {
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/users/profile/avatar`

    const {
      response,
    }: {
      response: Blob
    } = yield call(ajax, {
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${session!.token}`,
      },
      responseType: 'blob',
    })
    const result = getMyAvatarSuccess({
      blob: response,
    })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)
    const result = getMyAvatarFailure(errorMessage)

    yield put(result)

    if (then) {
      then(result)
    }
  }
}

function* setMyAvatar(action: Types.SetMyAvatarRequestAction) {
  const { file, then } = action.payload

  try {
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/users/profile/avatar`
    const form = new FormData()

    form.append('file', file)

    yield call(ajax, {
      method: 'PUT',
      url,
      headers: {
        Authorization: `Bearer ${session!.token}`,
      },
      body: form,
      responseType: 'json',
    })
    const result = setMyAvatarSuccess({ blob: file })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)
    const result = setMyAvatarFailure(errorMessage)

    yield put(result)

    if (then) {
      then(result)
    }
  }
}

function* deleteMyAvatar(action: Types.DeleteMyAvatarRequestAction) {
  const { then } = action.payload

  try {
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/users/profile/avatar`

    yield call(ajax, {
      method: 'DELETE',
      url,
      headers: {
        Authorization: `Bearer ${session!.token}`,
      },
      responseType: 'json',
    })
    const result = deleteMyAvatarSuccess()

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)
    const result = deleteMyAvatarFailure(errorMessage)

    yield put(result)

    if (then) {
      then(result)
    }
  }
}

export default [
  takeEveryQueue(
    10,
    Types.GET_USER_AVATAR_REQUEST,
    [Types.GET_USER_AVATAR_SUCCESS, Types.GET_USER_AVATAR_FAILURE],
    getUserAvatar,
  ),
  takeLatest(Types.GET_MY_AVATAR_REQUEST, getMyAvatar),
  takeLatest(Types.SET_MY_AVATAR_REQUEST, setMyAvatar),
  takeLatest(Types.DELETE_MY_AVATAR_REQUEST, deleteMyAvatar),
]
