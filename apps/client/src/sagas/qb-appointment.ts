import {
  call,
  put,
  SagaReturnType,
  select,
  takeEvery,
} from 'redux-saga/effects'
import QB, {
  promisifyCall,
  QBAppointment,
  QBDataDeletedResponse,
} from '@qc/quickblox'

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
import { normalize } from '../utils/normalize'
import { stringifyError } from '../utils/parse'
import { authMyAccountIdSelector, authSessionSelector } from '../selectors'
import { ajax } from './ajax'

interface AppointmentResponse {
  class_name: string
  items: QBAppointment[]
  limit: number
  skip: number
}

function* getAppointments(action: Types.QBAppointmentGetRequestAction) {
  const { className, filters, then } = action.payload

  try {
    const { items, limit, skip }: AppointmentResponse = yield promisifyCall(
      QB.data.list<QBAppointment>,
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
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )

    const url = `${SERVER_APP_URL}/appointments`

    const {
      response,
    }: {
      response: QBAppointment
    } = yield call(ajax, {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session!.token}`,
      },
      body: JSON.stringify(data),
      responseType: 'json',
    })

    const result = createAppointmentSuccess(response)

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
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/appointments/${_id}`

    const {
      response,
    }: {
      response: QBAppointment
    } = yield call(ajax, {
      method: 'PATCH',
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session!.token}`,
      },
      body: JSON.stringify(data),
      responseType: 'json',
    })
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
    const { items }: AppointmentResponse = yield promisifyCall(
      QB.data.list,
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

      const data: QBDataDeletedResponse = yield promisifyCall(
        QB.data.delete,
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
