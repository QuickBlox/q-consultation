import { QBAppointment, QBChatDialog, QBUser } from '@qc/quickblox'
import { Action } from 'redux'

export const QB_DIALOG_GET_REQUEST = 'QB_DIALOG_GET_REQUEST'
export const QB_DIALOG_GET_SUCCESS = 'QB_DIALOG_GET_SUCCESS'
export const QB_DIALOG_GET_FAILURE = 'QB_DIALOG_GET_FAILURE'
export const QB_DIALOG_CREATE_REQUEST = 'QB_DIALOG_CREATE_REQUEST'
export const QB_DIALOG_CREATE_SUCCESS = 'QB_DIALOG_CREATE_SUCCESS'
export const QB_DIALOG_CREATE_FAILURE = 'QB_DIALOG_CREATE_FAILURE'
export const QB_DIALOG_SELECT = 'QB_DIALOG_SELECT'
export const QB_DIALOG_SELECT_CLEAR = 'QB_DIALOG_SELECT_CLEAR'
export const QB_DIALOG_JOIN_REQUEST = 'QB_DIALOG_JOIN_REQUEST'
export const QB_DIALOG_JOIN_SUCCESS = 'QB_DIALOG_JOIN_SUCCESS'
export const QB_DIALOG_JOIN_FAILURE = 'QB_DIALOG_JOIN_FAILURE'

export interface QBDialogGetSuccessAction extends Action {
  type: typeof QB_DIALOG_GET_SUCCESS
  payload: Dictionary<QBChatDialog>
}

export interface GetDialogPayload {
  _id?: QBChatDialog['_id']
  skip?: number
  limit?: number
  then?: (data: QBDialogGetSuccessAction) => void
}

export interface QBDialogGetRequestAction<T extends GetDialogPayload>
  extends Action {
  type: typeof QB_DIALOG_GET_REQUEST
  payload: T
}

export interface GetDialogResponse {
  items: QBChatDialog[]
  limit: number
  skip: number
  total_entries: number
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

export interface QBDialogSelectAction extends Action {
  type: typeof QB_DIALOG_SELECT
  payload: QBChatDialog['_id']
}

export interface QBDialogSelectClearAction extends Action {
  type: typeof QB_DIALOG_SELECT_CLEAR
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

export type QBDialogAction =
  | QBDialogGetRequestAction<GetDialogPayload>
  | QBDialogGetSuccessAction
  | QBDialogGetFailureAction
  | QBDialogCreateRequestAction
  | QBDialogCreateSuccessAction
  | QBDialogCreateFailureAction
  | QBDialogSelectAction
  | QBDialogSelectClearAction
  | QBDialogJoinRequestAction
  | QBDialogJoinSuccessAction
  | QBDialogJoinFailureAction
