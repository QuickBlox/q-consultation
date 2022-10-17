import { Action } from 'redux'

export const QB_APPOINTMENT_GET_REQUEST = 'QB_APPOINTMENT_GET_REQUEST'
export const QB_APPOINTMENT_GET_SUCCESS = 'QB_APPOINTMENT_GET_SUCCESS'
export const QB_APPOINTMENT_GET_FAILURE = 'QB_APPOINTMENT_GET_FAILURE'
export const QB_APPOINTMENT_UPDATE_REQUEST = 'QB_APPOINTMENT_UPDATE_REQUEST'
export const QB_APPOINTMENT_UPDATE_SUCCESS = 'QB_APPOINTMENT_UPDATE_SUCCESS'
export const QB_APPOINTMENT_UPDATE_FAILURE = 'QB_APPOINTMENT_UPDATE_FAILURE'
export const QB_CLEAR_APPOINTMENT_OF_DELETED_USERS =
  'QB_CLEAR_APPOINTMENT_OF_DELETED_USERS'

export type AppointmentReset = 'history' | 'liveQueue'

export interface QBAppointmentGetRequestAction extends Action {
  type: typeof QB_APPOINTMENT_GET_REQUEST
  payload: {
    className: string
    filters: Dictionary<unknown>
    reset?: AppointmentReset
  }
}

export interface QBAppointmentGetSuccessAction extends Action {
  type: typeof QB_APPOINTMENT_GET_SUCCESS
  payload: {
    entries: Dictionary<QBAppointment>
    history: Array<QBAppointment['_id']>
    liveQueue: Array<QBAppointment['_id']>
    reset?: AppointmentReset
    limit: number
    skip: number
  }
}

export interface QBAppointmentGetFailureAction extends Action {
  type: typeof QB_APPOINTMENT_GET_FAILURE
  error: string
}

export interface QBAppointmentUpdateSuccessAction extends Action {
  type: typeof QB_APPOINTMENT_UPDATE_SUCCESS
  payload: {
    appointment: QBAppointment
    myAccountId?: QBUser['id']
    history: Array<QBAppointment['_id']>
    liveQueue: Array<QBAppointment['_id']>
  }
}

export interface QBAppointmentUpdateFailureAction extends Action {
  type: typeof QB_APPOINTMENT_UPDATE_FAILURE
  payload: {
    message: string
    data?: { code?: number; id: QBAppointment['_id'] }
  }
}

export interface QBAppointmentUpdateRequestAction extends Action {
  type: typeof QB_APPOINTMENT_UPDATE_REQUEST
  payload: {
    _id: string
    data: Dictionary<unknown>
    then?: (
      data: QBAppointmentUpdateSuccessAction | QBAppointmentUpdateFailureAction,
    ) => void
  }
}

export interface QBClearAppointmentsOfDeletedUsers extends Action {
  type: typeof QB_CLEAR_APPOINTMENT_OF_DELETED_USERS
  payload: Array<QBAppointment['_id']>
}

export type QBAppointmentAction =
  | QBAppointmentGetRequestAction
  | QBAppointmentGetSuccessAction
  | QBAppointmentGetFailureAction
  | QBAppointmentUpdateRequestAction
  | QBAppointmentUpdateSuccessAction
  | QBAppointmentUpdateFailureAction
  | QBClearAppointmentsOfDeletedUsers
