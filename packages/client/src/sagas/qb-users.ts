import cloneDeep from 'lodash/cloneDeep'
import { call, put, takeEvery } from 'redux-saga/effects'

import * as Types from '../actions'
import {
  getUserFailure,
  getUserSuccess,
  listUsersFailure,
  listUsersSuccess,
} from '../actionCreators'
import { QBUserGet, QBUserList } from '../qb-api-calls'
import { normalize } from '../utils/normalize'
import { isQBError, stringifyError } from '../utils/parse'

function* getUser(action: Types.QBUserGetRequestAction) {
  const { data, then } = action.payload

  try {
    const response: ListUserResponse | QBUser = yield call(QBUserGet, data)

    let result: Types.QBUserGetSuccessAction

    if ('items' in response) {
      const { items, current_page, per_page, total_entries } = response

      const userList = items.map(({ user }) => user)
      const { entries } = normalize(userList, 'id')

      result = getUserSuccess({
        current_page,
        entries,
        per_page,
        total_entries,
      })
    } else {
      const { entries } = normalize([response], 'id')

      result = getUserSuccess({
        entries,
        current_page: 1,
        per_page: 1,
        total_entries: 1,
      })
    }

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const getErrorMessage = (error: unknown) => {
      if (isQBError(error)) {
        return error.message
      }

      return e
    }

    const message = getErrorMessage(e)

    const errorMessage = stringifyError(message)
    const failure = getUserFailure(
      errorMessage,
      isQBError(e) ? e.code : undefined,
    )

    yield put(failure)

    if (then) {
      then(failure)
    }
  }
}

function* listUsers(action: Types.QBUserListRequestAction) {
  const data = action.payload

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

    yield put(
      listUsersSuccess({
        current_page,
        entries,
        per_page,
        total_entries,
        not_found,
      }),
    )
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(listUsersFailure(errorMessage))
  }
}

export default [
  takeEvery(Types.QB_USER_GET_REQUEST, getUser),
  takeEvery(Types.QB_USER_LIST_REQUEST, listUsers),
]
