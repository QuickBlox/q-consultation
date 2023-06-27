import { call, cps, put, takeEvery } from 'redux-saga/effects'
import cloneDeep from 'lodash/cloneDeep'

import * as Types from '../actions'
import {
  createUserFailure,
  createUserSuccess,
  getUserFailure,
  getUserSuccess,
  listUsersFailure,
  listUsersSuccess,
} from '../actionCreators'
import { QBUserGet, QBUserList } from '../qb-api-calls'
import { stringifyError } from '../utils/parse'
import { normalize } from '../utils/normalize'

function* getUser(action: Types.QBUserGetRequestAction) {
  const { data, then } = action.payload

  try {
    const { items, current_page, per_page, total_entries }: ListUserResponse =
      yield call(QBUserGet, data)
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
      yield call(QBUserList, cloneDeep(data))
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
    const qb = new QB.QuickBlox()
    const config: QBConfig = {
      debug: __DEV__ || QB_SDK_CONFIG_DEBUG,
      endpoints: {},
      webrtc: {},
    }

    if (QB_SDK_CONFIG_ENDPOINT_CHAT) {
      config.endpoints.chat = QB_SDK_CONFIG_ENDPOINT_CHAT
    }

    if (QB_SDK_CONFIG_ENDPOINT_API) {
      config.endpoints.api = QB_SDK_CONFIG_ENDPOINT_API
    }

    if (QB_SDK_CONFIG_ICE_SERVERS && QB_SDK_CONFIG_ICE_SERVERS.length) {
      config.webrtc.iceServers = QB_SDK_CONFIG_ICE_SERVERS
    }
    yield call(
      [qb, qb.init],
      QB_SDK_CONFIG_APP_ID,
      QB_SDK_CONFIG_AUTH_KEY,
      QB_SDK_CONFIG_AUTH_SECRET,
      QB_SDK_CONFIG_ACCOUNT_KEY,
      config,
    )
    yield cps([qb, qb.auth.createSession])
    yield cps([qb, qb.users.create], userData)
    const user: QBUser = yield cps([qb, qb.login], {
      login: userData.login || '',
      password: userData.password,
    })
    const { session } = yield cps([qb, qb.getSession])

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

export default [
  takeEvery(Types.QB_USER_GET_REQUEST, getUser),
  takeEvery(Types.QB_USER_LIST_REQUEST, listUsers),
  takeEvery(Types.QB_CREATE_USER_REQUEST, createUser),
]
