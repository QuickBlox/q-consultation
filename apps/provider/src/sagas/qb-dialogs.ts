import {
  all,
  delay,
  put,
  race,
  SagaReturnType,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'
import QB, { promisifyCall, QBChatDialog } from '@qc/quickblox'

import * as Types from '../actions'
import {
  createDialogFailure,
  createDialogSuccess,
  getDialogFailure,
  getDialogSuccess,
  joinDialog as joinDialogRequest,
  joinDialogFailure,
  joinDialogSuccess,
  leaveDialogFailure,
  leaveDialogSuccess,
  updateDialogFailure,
  updateDialogSuccess,
} from '../actionCreators'
import { authMyAccountIdSelector, chatConnectedSelector } from '../selectors'
import { stringifyError } from '../utils/parse'
import { normalize } from '../utils/normalize'

function* getDialog(
  action: Types.QBDialogGetRequestAction<Types.GetDialogPayload>,
) {
  const { then, ...params } = action.payload

  try {
    const { items }: Types.GetDialogResponse = yield promisifyCall(
      QB.chat.dialog.list,
      params,
    )
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
  const { userIds, type, data = {}, then } = action.payload

  try {
    const myAccountId: SagaReturnType<typeof authMyAccountIdSelector> =
      yield select(authMyAccountIdSelector)
    const dialog: QBChatDialog = yield promisifyCall(
      QB.chat.dialog.create,
      type === 'group'
        ? {
            name: '-',
            occupants_ids: Array.isArray(userIds) ? userIds : [userIds],
            type: 2,
            data,
          }
        : {
            occupants_ids: Array.isArray(userIds) ? userIds : [userIds],
            type: 3,
            data,
          },
    )

    if (Array.isArray(userIds) && userIds.includes(myAccountId)) {
      yield put(joinDialogRequest(dialog._id))
    }
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

function* updateDialog(action: Types.QBDialogUpdateRequestAction) {
  const { dialogId, data, then } = action.payload

  try {
    const dialog: QBChatDialog = yield promisifyCall(
      QB.chat.dialog.update,
      dialogId,
      data,
    )
    const result = updateDialogSuccess(dialog)

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(updateDialogFailure(errorMessage))
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
    yield race([promisifyCall(QB.chat.muc.join, action.payload), delay(1500)])
    yield put(joinDialogSuccess(action.payload))
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(joinDialogFailure(errorMessage))
  }
}

function* leaveDialog(action: Types.QBDialogJoinRequestAction) {
  try {
    yield promisifyCall(QB.chat.muc.leave, action.payload)
    yield put(leaveDialogSuccess(action.payload))
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(leaveDialogFailure(errorMessage))
  }
}

export default [
  takeEvery(Types.QB_DIALOG_GET_REQUEST, getDialog),
  takeEvery(Types.QB_DIALOG_CREATE_REQUEST, createDialog),
  takeEvery(Types.QB_DIALOG_UPDATE_REQUEST, updateDialog),
  takeEvery(Types.QB_DIALOG_JOIN_REQUEST, joinDialog),
  takeEvery(Types.QB_DIALOG_LEAVE_REQUEST, leaveDialog),
]
