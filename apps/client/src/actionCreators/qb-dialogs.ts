import { QBAppointment, QBChatDialog, QBUser } from '@qc/quickblox'
import * as Types from '../actions'

export function getDialog<T extends Types.GetDialogPayload>(
  payload: T,
): Types.QBDialogGetRequestAction<T> {
  return { type: Types.QB_DIALOG_GET_REQUEST, payload }
}

export function getDialogSuccess(
  payload: Dictionary<QBChatDialog>,
): Types.QBDialogGetSuccessAction {
  return { type: Types.QB_DIALOG_GET_SUCCESS, payload }
}

export function getDialogFailure(
  error: string,
): Types.QBDialogGetFailureAction {
  return { type: Types.QB_DIALOG_GET_FAILURE, error }
}

export function createDialog(payload: {
  userId: QBUser['id']
  data?: { class_name: string; _id: QBAppointment['_id'] }
  then?: (data: Types.QBDialogCreateSuccessAction) => void
}): Types.QBDialogCreateRequestAction {
  return { type: Types.QB_DIALOG_CREATE_REQUEST, payload }
}

export function createDialogSuccess(
  chat: QBChatDialog,
): Types.QBDialogCreateSuccessAction {
  return { type: Types.QB_DIALOG_CREATE_SUCCESS, payload: chat }
}

export function createDialogFailure(
  error: string,
): Types.QBDialogCreateFailureAction {
  return { type: Types.QB_DIALOG_CREATE_FAILURE, error }
}

export function selectDialog(
  dialogId: QBChatDialog['_id'],
): Types.QBDialogSelectAction {
  return { type: Types.QB_DIALOG_SELECT, payload: dialogId }
}

export function resetSelectedDialog(): Types.QBDialogSelectClearAction {
  return { type: Types.QB_DIALOG_SELECT_CLEAR }
}

export function joinDialog(
  payload: QBChatDialog['_id'],
): Types.QBDialogJoinRequestAction {
  return { type: Types.QB_DIALOG_JOIN_REQUEST, payload }
}

export function joinDialogSuccess(
  payload: QBChatDialog['_id'],
): Types.QBDialogJoinSuccessAction {
  return { type: Types.QB_DIALOG_JOIN_SUCCESS, payload }
}

export function joinDialogFailure(
  error: string,
): Types.QBDialogJoinFailureAction {
  return { type: Types.QB_DIALOG_JOIN_FAILURE, error }
}
