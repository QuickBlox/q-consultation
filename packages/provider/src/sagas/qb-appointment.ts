import {
  call,
  put,
  SagaReturnType,
  select,
  takeEvery,
} from 'redux-saga/effects'

import * as Types from '../actions'
import {
  clearAppointmentsOfDeletedUsers,
  getAppointmentsFailure,
  getAppointmentsSuccess,
  updateAppointmentFailure,
  updateAppointmentSuccess,
} from '../actionCreators'
import { QBDataDelete, QBDataGet, QBDataUpdate } from '../qb-api-calls'
import { normalize } from '../utils/normalize'
import { isQBError, stringifyError } from '../utils/parse'
import { authMyAccountIdSelector } from '../selectors'

interface AppointmentResponse {
  class_name: string
  items: QBAppointment[]
  limit: number
  skip: number
}

function* getAppointments(action: Types.QBAppointmentGetRequestAction) {
  const { className, filters, reset } = action.payload

  try {
    const { items, limit, skip }: AppointmentResponse = yield call(
      QBDataGet,
      className,
      filters,
    )
    const { entries, list } = normalize(items, '_id')

    const history: Array<QBAppointment['_id']> = []
    const liveQueue: Array<QBAppointment['_id']> = []

    list.forEach((appointmentId) => {
      const appointment = entries[appointmentId]

      if (appointment.date_end) {
        history.push(appointmentId)
      } else if (!appointment.date_start) {
        liveQueue.push(appointmentId)
      }
    })

    yield put(
      getAppointmentsSuccess({
        entries,
        limit,
        skip,
        history,
        liveQueue,
        reset,
      }),
    )
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(getAppointmentsFailure(errorMessage))
  }
}

function* updateAppointment(action: Types.QBAppointmentUpdateRequestAction) {
  const { _id, data, then } = action.payload

  try {
    const response: QBAppointment = yield call(
      QBDataUpdate,
      'Appointment',
      _id,
      data,
    )
    const myAccountId: SagaReturnType<typeof authMyAccountIdSelector> =
      yield select(authMyAccountIdSelector)

    const history: Array<QBAppointment['_id']> = []
    const liveQueue: Array<QBAppointment['_id']> = []
    const filterIds: Array<QBAppointment['_id']> = []

    if (response.provider_id !== myAccountId) {
      filterIds.push(response._id)
    } else if (response.date_end) {
      history.push(response._id)
    } else if (!response.date_start) {
      liveQueue.push(response._id)
    }

    const success = updateAppointmentSuccess({
      appointment: response,
      history,
      liveQueue,
      filterIds,
    })

    yield put(success)

    if (then) {
      then(success)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)
    const failure = updateAppointmentFailure(errorMessage, {
      id: _id,
      code: isQBError(e) ? e.code : undefined,
    })

    yield put(failure)

    if (then) {
      then(failure)
    }
  }
}

export function* clearAppointmentsOfDeletedUsersSaga(
  action: Types.QBUserListSuccessAction,
) {
  const userIds = action.payload.not_found
  const myAccountId: SagaReturnType<typeof authMyAccountIdSelector> =
    yield select(authMyAccountIdSelector)
  const { items }: AppointmentResponse = yield call(QBDataGet, 'Appointment', {
    provider_id: myAccountId,
    client_id: {
      in: userIds,
    },
    sort_desc: 'date_end',
    limit: 100,
  })

  if (items.length) {
    const appointmentIds = items.map(({ _id }) => _id)

    const data: QBDataDeletedResponse = yield call(
      QBDataDelete,
      'Appointment',
      appointmentIds.length === 1 ? appointmentIds[0] : appointmentIds,
    )

    yield put(clearAppointmentsOfDeletedUsers(data.deleted))
  }
}

export default [
  takeEvery(Types.QB_USER_LIST_SUCCESS, clearAppointmentsOfDeletedUsersSaga),
  takeEvery(Types.QB_APPOINTMENT_GET_REQUEST, getAppointments),
  takeEvery(Types.QB_APPOINTMENT_UPDATE_REQUEST, updateAppointment),
]
