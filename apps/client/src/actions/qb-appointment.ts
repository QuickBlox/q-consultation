import { QBAppointment, QBChatDialog, QBUser } from '@qc/quickblox'
import { Action } from 'redux'

export const QB_APPOINTMENT_GET_REQUEST = 'QB_APPOINTMENT_GET_REQUEST'
export const QB_APPOINTMENT_GET_SUCCESS = 'QB_APPOINTMENT_GET_SUCCESS'
export const QB_APPOINTMENT_GET_FAILURE = 'QB_APPOINTMENT_GET_FAILURE'
export const QB_APPOINTMENT_CREATE_REQUEST = 'QB_APPOINTMENT_CREATE_REQUEST'
export const QB_APPOINTMENT_CREATE_SUCCESS = 'QB_APPOINTMENT_CREATE_SUCCESS'
export const QB_APPOINTMENT_CREATE_FAILURE = 'QB_APPOINTMENT_CREATE_FAILURE'
export const QB_APPOINTMENT_UPDATE_REQUEST = 'QB_APPOINTMENT_UPDATE_REQUEST'
export const QB_APPOINTMENT_UPDATE_SUCCESS = 'QB_APPOINTMENT_UPDATE_SUCCESS'
export const QB_APPOINTMENT_UPDATE_FAILURE = 'QB_APPOINTMENT_UPDATE_FAILURE'
export const QB_APPOINTMENT_DIALOG_CREATE_REQUEST =
  'QB_APPOINTMENT_DIALOG_CREATE_REQUEST'
export const QB_APPOINTMENT_DIALOG_CREATE_SUCCESS =
  'QB_APPOINTMENT_DIALOG_CREATE_SUCCESS'
export const QB_APPOINTMENT_DIALOG_CREATE_FAILURE =
  'QB_APPOINTMENT_DIALOG_CREATE_FAILURE'
export const QB_CLEAR_APPOINTMENT_OF_DELETED_USERS =
  'QB_CLEAR_APPOINTMENT_OF_DELETED_USERS'

export interface QBAppointmentGetSuccessAction extends Action {
  type: typeof QB_APPOINTMENT_GET_SUCCESS
  payload: {
    skip: number
    limit: number
    entries: Dictionary<QBAppointment>
  }
}

export interface QBAppointmentGetRequestAction extends Action {
  type: typeof QB_APPOINTMENT_GET_REQUEST
  payload: {
    className: string
    filters: Dictionary<unknown>
    then?: (data: QBAppointmentGetSuccessAction) => void
  }
}

export interface QBAppointmentGetFailureAction extends Action {
  type: typeof QB_APPOINTMENT_GET_FAILURE
  error: string
}

export interface QBAppointmentCreateSuccessAction extends Action {
  type: typeof QB_APPOINTMENT_CREATE_SUCCESS
  payload: QBAppointment
}

export interface QBAppointmentCreateRequestAction extends Action {
  type: typeof QB_APPOINTMENT_CREATE_REQUEST
  payload: {
    client_id: QBUser['id']
    provider_id: QBUser['id']
    description: string
    then?: (data: QBAppointmentCreateSuccessAction) => void
  }
}

export interface QBAppointmentCreateFailureAction extends Action {
  type: typeof QB_APPOINTMENT_CREATE_FAILURE
  error: string
}

export interface QBAppointmentUpdateSuccessAction extends Action {
  type: typeof QB_APPOINTMENT_UPDATE_SUCCESS
  payload: { appointment: QBAppointment; myAccountId?: QBUser['id'] }
}

export interface QBAppointmentUpdateRequestAction extends Action {
  type: typeof QB_APPOINTMENT_UPDATE_REQUEST
  payload: {
    _id: string
    data: Dictionary<unknown>
    then?: (data: QBAppointmentUpdateSuccessAction) => void
  }
}

export interface QBAppointmentUpdateFailureAction extends Action {
  type: typeof QB_APPOINTMENT_UPDATE_FAILURE
  error: string
}

export interface QBClearAppointmentsOfDeletedUsers extends Action {
  type: typeof QB_CLEAR_APPOINTMENT_OF_DELETED_USERS
  payload: Array<QBAppointment['_id']>
}

export interface QBAppointmentDialogCreateSuccessAction extends Action {
  type: typeof QB_APPOINTMENT_DIALOG_CREATE_SUCCESS
  payload: QBAppointment
}

export interface QBAppointmentDialogCreateRequestAction extends Action {
  type: typeof QB_APPOINTMENT_DIALOG_CREATE_REQUEST
  payload: {
    dialog_id: QBChatDialog['_id']
    client_id: QBUser['id']
    provider_id: QBUser['id']
    then?: (data: QBAppointmentDialogCreateSuccessAction) => void
  }
}

export interface QBAppointmentDialogCreateFailureAction extends Action {
  type: typeof QB_APPOINTMENT_DIALOG_CREATE_FAILURE
  error: string
}

export type QBAppointmentAction =
  | QBAppointmentGetRequestAction
  | QBAppointmentGetSuccessAction
  | QBAppointmentGetFailureAction
  | QBAppointmentCreateRequestAction
  | QBAppointmentCreateSuccessAction
  | QBAppointmentCreateFailureAction
  | QBAppointmentUpdateRequestAction
  | QBAppointmentUpdateSuccessAction
  | QBAppointmentUpdateFailureAction
  | QBClearAppointmentsOfDeletedUsers
  | QBAppointmentDialogCreateRequestAction
  | QBAppointmentDialogCreateSuccessAction
  | QBAppointmentDialogCreateFailureAction
