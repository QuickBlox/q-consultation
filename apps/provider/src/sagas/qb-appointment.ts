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
import { isQBError, stringifyError, filterHasIdList } from '../utils/parse'
import { authMyAccountIdSelector, authSessionSelector } from '../selectors'
import { ajax } from './ajax'

interface AppointmentResponse {
  class_name: string
  items: QBAppointment[]
  limit: number
  skip: number
}

function* getAppointments(action: Types.QBAppointmentGetRequestAction) {
  const { className, filters, reset } = action.payload

  try {
    const { items, limit, skip }: AppointmentResponse = yield promisifyCall(
      QB.data.list,
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
      } else {
        liveQueue.push(appointmentId)
      }
    })

    let not_found: Array<QBAppointment['_id']> = []

    if (filterHasIdList(filters) && filters._id.in.length !== list.length) {
      not_found = filters._id.in.filter((id) => !list.includes(id))
    }

    yield put(
      getAppointmentsSuccess({
        entries,
        limit,
        skip,
        history,
        liveQueue,
        reset,
        not_found,
      }),
    )
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
    const myAccountId: SagaReturnType<typeof authMyAccountIdSelector> =
      yield select(authMyAccountIdSelector)
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

    const history: Array<QBAppointment['_id']> = []
    const liveQueue: Array<QBAppointment['_id']> = []
    const filterIds: Array<QBAppointment['_id']> = []

    if (response.provider_id !== myAccountId) {
      filterIds.push(response._id)
    } else if (response.date_end) {
      history.push(response._id)
    } else {
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
  const { items }: AppointmentResponse = yield promisifyCall(
    QB.data.list,
    'Appointment',
    {
      provider_id: myAccountId,
      client_id: {
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

export default [
  takeEvery(Types.QB_USER_LIST_SUCCESS, clearAppointmentsOfDeletedUsersSaga),
  takeEvery(Types.QB_APPOINTMENT_GET_REQUEST, getAppointments),
  takeEvery(Types.QB_APPOINTMENT_CREATE_REQUEST, createAppointment),
  takeEvery(Types.QB_APPOINTMENT_UPDATE_REQUEST, updateAppointment),
]
