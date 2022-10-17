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
  createAppointmentFailure,
  createAppointmentSuccess,
  getAppointmentsFailure,
  getAppointmentsSuccess,
  updateAppointmentFailure,
  updateAppointmentSuccess,
} from '../actionCreators'
import {
  QBDataCreate,
  QBDataDelete,
  QBDataGet,
  QBDataUpdate,
} from '../qb-api-calls'
import { normalize } from '../utils/normalize'
import { stringifyError } from '../utils/parse'
import { authMyAccountIdSelector } from '../selectors'

interface AppointmentResponse {
  class_name: string
  items: QBAppointment[]
  limit: number
  skip: number
}

function* getAppointments(action: Types.QBAppointmentGetRequestAction) {
  const { className, filters, then } = action.payload

  try {
    const { items, limit, skip }: AppointmentResponse = yield call(
      QBDataGet,
      className,
      filters,
    )
    const { entries } = normalize(items, '_id')

    const result = getAppointmentsSuccess({ entries, limit, skip })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(getAppointmentsFailure(errorMessage))
  }
}

function* createAppointment(action: Types.QBAppointmentCreateRequestAction) {
  const { then, ...data } = action.payload

  try {
    const customObject: QBAppointment = yield call(
      QBDataCreate,
      'Appointment',
      {
        priority: 0,
        ...data,
      },
    )

    const result = createAppointmentSuccess(customObject)

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(createAppointmentFailure(errorMessage))
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
    const result = updateAppointmentSuccess({ appointment: response })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(updateAppointmentFailure(errorMessage))
  }
}

export function* clearAppointmentsOfDeletedUsersSaga(
  action: Types.QBUserListSuccessAction,
) {
  const userIds = action.payload.not_found

  if (userIds.length) {
    const myAccountId: SagaReturnType<typeof authMyAccountIdSelector> =
      yield select(authMyAccountIdSelector)
    const { items }: AppointmentResponse = yield call(
      QBDataGet,
      'Appointment',
      {
        client_id: myAccountId,
        provider_id: {
          in: userIds,
        },
        sort_desc: 'date_end',
        limit: 100,
      },
    )

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
}

export default [
  takeEvery(Types.QB_USER_LIST_SUCCESS, clearAppointmentsOfDeletedUsersSaga),
  takeEvery(Types.QB_APPOINTMENT_GET_REQUEST, getAppointments),
  takeEvery(Types.QB_APPOINTMENT_CREATE_REQUEST, createAppointment),
  takeEvery(Types.QB_APPOINTMENT_UPDATE_REQUEST, updateAppointment),
]
