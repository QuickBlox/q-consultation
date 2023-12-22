import { QBAppointment, QBChatDialog, QBUser } from '@qc/quickblox'
import { Action } from 'redux'

export const QB_DIALOG_GET_REQUEST = 'QB_DIALOG_GET_REQUEST'
export const QB_DIALOG_GET_SUCCESS = 'QB_DIALOG_GET_SUCCESS'
export const QB_DIALOG_GET_FAILURE = 'QB_DIALOG_GET_FAILURE'
export const QB_DIALOG_CREATE_REQUEST = 'QB_DIALOG_CREATE_REQUEST'
export const QB_DIALOG_CREATE_SUCCESS = 'QB_DIALOG_CREATE_SUCCESS'
export const QB_DIALOG_CREATE_FAILURE = 'QB_DIALOG_CREATE_FAILURE'
export const QB_DIALOG_UPDATE_REQUEST = 'QB_DIALOG_UPDATE_REQUEST'
export const QB_DIALOG_UPDATE_SUCCESS = 'QB_DIALOG_UPDATE_SUCCESS'
export const QB_DIALOG_UPDATE_FAILURE = 'QB_DIALOG_UPDATE_FAILURE'
export const QB_DIALOG_JOIN_REQUEST = 'QB_DIALOG_JOIN_REQUEST'
export const QB_DIALOG_JOIN_SUCCESS = 'QB_DIALOG_JOIN_SUCCESS'
export const QB_DIALOG_JOIN_FAILURE = 'QB_DIALOG_JOIN_FAILURE'
export const QB_DIALOG_LEAVE_REQUEST = 'QB_DIALOG_LEAVE_REQUEST'
export const QB_DIALOG_LEAVE_SUCCESS = 'QB_DIALOG_LEAVE_SUCCESS'
export const QB_DIALOG_LEAVE_FAILURE = 'QB_DIALOG_LEAVE_FAILURE'

export interface GetDialogResponse {
  items: QBChatDialog[]
  limit: number
  skip: number
  total_entries: number
}

export interface QBDialogGetSuccessAction extends Action {
  type: typeof QB_DIALOG_GET_SUCCESS
  payload: Dictionary<QBChatDialog>
}

export interface GetDialogPayload {
  _id?: QBChatDialog['_id']
  type?: 1 | 2 | 3
  skip?: number
  limit?: number
  '_id[in]'?: string
  'occupants_ids[in]'?: string
  then?: (data: QBDialogGetSuccessAction) => void
}

export interface QBDialogGetRequestAction<T extends GetDialogPayload>
  extends Action {
  type: typeof QB_DIALOG_GET_REQUEST
  payload: T
}

export interface QBDialogGetFailureAction extends Action {
  type: typeof QB_DIALOG_GET_FAILURE
  error: string
}

export interface QBDialogCreateSuccessAction extends Action {
  type: typeof QB_DIALOG_CREATE_SUCCESS
  payload: QBChatDialog
}

export interface QBDialogCreateRequestAction extends Action {
  type: typeof QB_DIALOG_CREATE_REQUEST
  payload: {
    userIds: QBUser['id'] | Array<QBUser['id']>
    type: 'group' | 'private'
    data?: { class_name: string; _id: QBAppointment['_id'] }
    then?: (data: QBDialogCreateSuccessAction) => void
  }
}

export interface QBDialogCreateFailureAction extends Action {
  type: typeof QB_DIALOG_CREATE_FAILURE
  error: string
}

export interface QBDialogUpdateSuccessAction extends Action {
  type: typeof QB_DIALOG_UPDATE_SUCCESS
  payload: QBChatDialog
}

export interface QBDialogUpdateRequestAction extends Action {
  type: typeof QB_DIALOG_UPDATE_REQUEST
  payload: {
    dialogId: QBChatDialog['_id']
    data: { push_all: { occupants_ids: number[] } }
    then?: (data: QBDialogUpdateSuccessAction) => void
  }
}

export interface QBDialogUpdateFailureAction extends Action {
  type: typeof QB_DIALOG_UPDATE_FAILURE
  error: string
}

export interface QBDialogJoinRequestAction extends Action {
  type: typeof QB_DIALOG_JOIN_REQUEST
  payload: QBChatDialog['_id']
}

export interface QBDialogJoinSuccessAction extends Action {
  type: typeof QB_DIALOG_JOIN_SUCCESS
  payload: QBChatDialog['_id']
}

export interface QBDialogJoinFailureAction extends Action {
  type: typeof QB_DIALOG_JOIN_FAILURE
  error: string
}

export interface QBDialogLeaveRequestAction extends Action {
  type: typeof QB_DIALOG_LEAVE_REQUEST
  payload: QBChatDialog['_id']
}

export interface QBDialogLeaveSuccessAction extends Action {
  type: typeof QB_DIALOG_LEAVE_SUCCESS
  payload: QBChatDialog['_id']
}

export interface QBDialogLeaveFailureAction extends Action {
  type: typeof QB_DIALOG_LEAVE_FAILURE
  error: string
}

export type QBDialogAction =
  | QBDialogGetRequestAction<GetDialogPayload>
  | QBDialogGetSuccessAction
  | QBDialogGetFailureAction
  | QBDialogCreateRequestAction
  | QBDialogCreateSuccessAction
  | QBDialogCreateFailureAction
  | QBDialogUpdateRequestAction
  | QBDialogUpdateSuccessAction
  | QBDialogUpdateFailureAction
  | QBDialogJoinRequestAction
  | QBDialogJoinSuccessAction
  | QBDialogJoinFailureAction
  | QBDialogLeaveRequestAction
  | QBDialogLeaveSuccessAction
  | QBDialogLeaveFailureAction
