import {
  all,
  call,
  delay,
  put,
  race,
  SagaReturnType,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import * as Types from '../actions'
import {
  createDialogFailure,
  createDialogSuccess,
  getDialogFailure,
  getDialogSuccess,
  joinDialog as joinDialogRequest,
  joinDialogFailure,
  joinDialogSuccess,
} from '../actionCreators'
import { QBCreateDialog, QBGetDialog, QBJoinDialog } from '../qb-api-calls'
import { normalize } from '../utils/normalize'
import { chatConnectedSelector } from '../selectors'
import { stringifyError } from '../utils/parse'

function* getDialog(
  action: Types.QBDialogGetRequestAction<Types.GetDialogPayload>,
) {
  const { then, ...params } = action.payload

  try {
    const { items }: Types.GetDialogResponse = yield call(QBGetDialog, params)
    const { entries } = normalize(items, '_id')
    const result = getDialogSuccess(entries)

    yield put(result)
    yield all(items.map(({ _id }) => put(joinDialogRequest(_id))))

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(getDialogFailure(errorMessage))
  }
}

function* createDialog(action: Types.QBDialogCreateRequestAction) {
  const { userId, data, then } = action.payload

  try {
    const dialog: SagaReturnType<typeof QBCreateDialog> = yield call(
      QBCreateDialog,
      userId,
      data,
    )
    const result = createDialogSuccess(dialog)

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(createDialogFailure(errorMessage))
  }
}

function* joinDialog(action: Types.QBDialogJoinRequestAction) {
  try {
    const connected: ReturnType<typeof chatConnectedSelector> = yield select(
      chatConnectedSelector,
    )

    if (!connected) {
      yield take(Types.QB_CHAT_CONNECTED)
    }
    // TODO: Remove `race` after fixing callback call in `QB.chat.muc.join`
    yield race([call(QBJoinDialog, action.payload), delay(1500)])
    const result = joinDialogSuccess(action.payload)

    yield put(result)
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(joinDialogFailure(errorMessage))
  }
}

export default [
  takeEvery(Types.QB_DIALOG_GET_REQUEST, getDialog),
  takeEvery(Types.QB_DIALOG_CREATE_REQUEST, createDialog),
  takeEvery(Types.QB_DIALOG_JOIN_REQUEST, joinDialog),
]
