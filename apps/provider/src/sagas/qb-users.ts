import { call, put, takeEvery, select } from 'redux-saga/effects'
import cloneDeep from 'lodash/cloneDeep'
import QB, {
  ListUserResponse,
  QBConfig,
  QBUser,
  QBSession,
  promisifyCall,
  QBExtended,
} from '@qc/quickblox'

import * as Types from '../actions'
import {
  createGuestClientFailure,
  createGuestClientSuccess,
  createUserFailure,
  createUserSuccess,
  getUserFailure,
  getUserSuccess,
  listUsersFailure,
  listUsersSuccess,
} from '../actionCreators'
import { stringifyError } from '../utils/parse'
import { normalize } from '../utils/normalize'
import { authSessionSelector } from '../selectors'
import { ajax } from './ajax'

function* getUser(action: Types.QBUserGetRequestAction) {
  const { data, then } = action.payload

  try {
    const { items, current_page, per_page, total_entries }: ListUserResponse =
      yield promisifyCall(QB.users.get, data)
    const userList = items.map(({ user }) => user)
    const { entries, list } = normalize(userList, 'id')

    const result = getUserSuccess({
      current_page,
      list,
      entries,
      per_page,
      total_entries,
    })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)
    const failure = getUserFailure(errorMessage, data)

    yield put(getUserFailure(errorMessage, data))

    if (then) {
      then(failure)
    }
  }
}

function* listUsers(action: Types.QBUserListRequestAction) {
  const { data, then } = action.payload

  try {
    const { items, current_page, per_page, total_entries }: ListUserResponse =
      yield promisifyCall(QB.users.listUsers, cloneDeep(data))
    const userList = items.map(({ user }) => user)
    const { entries, list } = normalize(userList, 'id')
    let not_found = []

    if (
      data.filter?.field === 'id' &&
      data.filter?.param === 'in' &&
      Array.isArray(data.filter?.value) &&
      data.filter.value.length !== list.length
    ) {
      not_found = data.filter.value.filter(
        (id) => typeof id === 'number' && !list.includes(id.toString()),
      )
    }

    const result = listUsersSuccess({
      current_page,
      list,
      entries,
      per_page,
      total_entries,
      not_found,
    })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(listUsersFailure(errorMessage))
  }
}

function* createUser(action: Types.QBCreateUserRequestAction) {
  try {
    const { then, user: userData } = action.payload
    const qb = new QBExtended()
    const config: QBConfig = {
      debug: __DEV__ || QB_SDK_CONFIG_DEBUG,
      endpoints: {
        chat: QB_SDK_CONFIG_ENDPOINT_CHAT,
        api: QB_SDK_CONFIG_ENDPOINT_API,
      },
      webrtc: {
        iceServers: QB_SDK_CONFIG_ICE_SERVERS as any,
      },
    }

    qb.init(
      QB_SDK_CONFIG_APP_ID,
      QB_SDK_CONFIG_AUTH_KEY,
      QB_SDK_CONFIG_AUTH_SECRET,
      QB_SDK_CONFIG_ACCOUNT_KEY,
      config,
    )
    yield promisifyCall(qb.createSession)
    yield promisifyCall(qb.users.create, userData)
    const user: QBUser = yield promisifyCall(qb.login, {
      login: userData.login || '',
      password: userData.password,
    })
    const { session }: { session: QBSession } = yield promisifyCall(
      qb.getSession,
    )

    const result = { session, user }

    yield put(createUserSuccess(result))

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(createUserFailure(errorMessage))
  }
}

function* createGuestUser(action: Types.QBCreateGuestUserRequestAction) {
  try {
    const { then, userName } = action.payload
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/users/guest-client`
    const { response }: { response: { session: QBSession; user: QBUser } } =
      yield call(ajax, {
        method: 'POST',
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session!.token}`,
        },
        body: JSON.stringify({ full_name: userName }),
        responseType: 'json',
      })

    yield put(createGuestClientSuccess(response))

    if (then) {
      then(response)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(createGuestClientFailure(errorMessage))
  }
}

export default [
  takeEvery(Types.QB_USER_GET_REQUEST, getUser),
  takeEvery(Types.QB_USER_LIST_REQUEST, listUsers),
  takeEvery(Types.QB_CREATE_USER_REQUEST, createUser),
  takeEvery(Types.QB_CREATE_GUEST_CLIENT_REQUEST, createGuestUser),
]
