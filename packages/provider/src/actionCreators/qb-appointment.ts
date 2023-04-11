import * as Types from '../actions'

export function getAppointmentsSuccess(payload: {
  entries: Dictionary<QBAppointment>
  history: Array<QBAppointment['_id']>
  liveQueue: Array<QBAppointment['_id']>
  reset?: Types.AppointmentReset
  limit: number
  skip: number
}): Types.QBAppointmentGetSuccessAction {
  return { type: Types.QB_APPOINTMENT_GET_SUCCESS, payload }
}

export function getAppointments(
  payload: {
    filters: Dictionary<unknown>
    reset?: Types.AppointmentReset
  },
  then?: (
    data: Types.QBAppointmentGetSuccessAction
  ) => void
): Types.QBAppointmentGetRequestAction {
  return {
    type: Types.QB_APPOINTMENT_GET_REQUEST,
    payload: { className: 'Appointment', ...payload, then },
  }
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
  then?: (
    data:
      | Types.QBAppointmentUpdateSuccessAction
      | Types.QBAppointmentUpdateFailureAction,
  ) => void
}): Types.QBAppointmentUpdateRequestAction {
  return { type: Types.QB_APPOINTMENT_UPDATE_REQUEST, payload }
}

export function updateAppointmentSuccess(payload: {
  appointment: QBAppointment
  myAccountId?: QBUser['id']
  history: Array<QBAppointment['_id']>
  liveQueue: Array<QBAppointment['_id']>
  filterIds: Array<QBAppointment['_id']>
}): Types.QBAppointmentUpdateSuccessAction {
  return { type: Types.QB_APPOINTMENT_UPDATE_SUCCESS, payload }
}

export function updateAppointmentFailure(
  message: string,
  data?: { code?: number; id: QBAppointment['_id'] },
): Types.QBAppointmentUpdateFailureAction {
  return {
    type: Types.QB_APPOINTMENT_UPDATE_FAILURE,
    payload: { message, data },
  }
}
