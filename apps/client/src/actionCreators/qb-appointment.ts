import { QBUser, QBAppointment } from '@qc/quickblox'
import * as Types from '../actions'

export function getAppointments(
  filters: Dictionary<unknown>,
  then?: (data: Types.QBAppointmentGetSuccessAction) => void,
): Types.QBAppointmentGetRequestAction {
  return {
    type: Types.QB_APPOINTMENT_GET_REQUEST,
    payload: { className: 'Appointment', filters, then },
  }
}

export function getAppointmentsSuccess(payload: {
  skip: number
  limit: number
  entries: Dictionary<QBAppointment>
}): Types.QBAppointmentGetSuccessAction {
  return { type: Types.QB_APPOINTMENT_GET_SUCCESS, payload }
}

export function getAppointmentsFailure(
  error: string,
): Types.QBAppointmentGetFailureAction {
  return { type: Types.QB_APPOINTMENT_GET_FAILURE, error }
}

export function createAppointment(
  payload: Types.QBAppointmentCreateRequestAction['payload'],
): Types.QBAppointmentCreateRequestAction {
  return { type: Types.QB_APPOINTMENT_CREATE_REQUEST, payload }
}

export function createAppointmentSuccess(
  appointment: QBAppointment,
): Types.QBAppointmentCreateSuccessAction {
  return { type: Types.QB_APPOINTMENT_CREATE_SUCCESS, payload: appointment }
}

export function createAppointmentFailure(
  error: string,
): Types.QBAppointmentCreateFailureAction {
  return { type: Types.QB_APPOINTMENT_CREATE_FAILURE, error }
}

export function updateAppointment(payload: {
  _id: string
  data: Dictionary<unknown>
  then?: (data?: Types.QBAppointmentUpdateSuccessAction) => void
}): Types.QBAppointmentUpdateRequestAction {
  return { type: Types.QB_APPOINTMENT_UPDATE_REQUEST, payload }
}

export function updateAppointmentSuccess(payload: {
  appointment: QBAppointment
  myAccountId?: QBUser['id']
}): Types.QBAppointmentUpdateSuccessAction {
  return { type: Types.QB_APPOINTMENT_UPDATE_SUCCESS, payload }
}

export function updateAppointmentFailure(
  error: string,
): Types.QBAppointmentUpdateFailureAction {
  return { type: Types.QB_APPOINTMENT_UPDATE_FAILURE, error }
}

export function clearAppointmentsOfDeletedUsers(
  payload: Array<QBAppointment['_id']>,
): Types.QBClearAppointmentsOfDeletedUsers {
  return { type: Types.QB_CLEAR_APPOINTMENT_OF_DELETED_USERS, payload }
}
