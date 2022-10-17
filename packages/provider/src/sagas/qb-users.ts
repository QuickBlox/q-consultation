import { call, put, takeEvery } from 'redux-saga/effects'
import cloneDeep from 'lodash/cloneDeep'

import * as Types from '../actions'
import {
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

export default [
  takeEvery(Types.QB_USER_GET_REQUEST, getUser),
  takeEvery(Types.QB_USER_LIST_REQUEST, listUsers),
]
