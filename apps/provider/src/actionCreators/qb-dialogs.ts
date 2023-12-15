import { QBChatDialog } from '@qc/quickblox'
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

export function createDialog(
  payload: Types.QBDialogCreateRequestAction['payload'],
): Types.QBDialogCreateRequestAction {
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

export function updateDialog(payload: {
  dialogId: QBChatDialog['_id']
  data: { push_all: { occupants_ids: number[] } }
  then?: (data: Types.QBDialogUpdateSuccessAction) => void
}): Types.QBDialogUpdateRequestAction {
  return { type: Types.QB_DIALOG_UPDATE_REQUEST, payload }
}

export function updateDialogSuccess(
  chat: QBChatDialog,
): Types.QBDialogUpdateSuccessAction {
  return { type: Types.QB_DIALOG_UPDATE_SUCCESS, payload: chat }
}

export function updateDialogFailure(
  error: string,
): Types.QBDialogUpdateFailureAction {
  return { type: Types.QB_DIALOG_UPDATE_FAILURE, error }
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

export function leaveDialog(
  payload: QBChatDialog['_id'],
): Types.QBDialogLeaveRequestAction {
  return { type: Types.QB_DIALOG_LEAVE_REQUEST, payload }
}

export function leaveDialogSuccess(
  payload: QBChatDialog['_id'],
): Types.QBDialogLeaveSuccessAction {
  return { type: Types.QB_DIALOG_LEAVE_SUCCESS, payload }
}

export function leaveDialogFailure(
  error: string,
): Types.QBDialogLeaveFailureAction {
  return { type: Types.QB_DIALOG_LEAVE_FAILURE, error }
}
