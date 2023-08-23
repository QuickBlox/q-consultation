import omit from 'lodash/omit'
import intersection from 'lodash/intersection'
import difference from 'lodash/difference'
import union from 'lodash/union'

import * as Types from '../actions'

export interface AppointmentReducer {
  entries: Dictionary<QBAppointment>
  liveQueue: Array<QBAppointment['_id']>
  history: Array<QBAppointment['_id']>
  error?: string
  loading: boolean
  limit: number
  skip: number
}

const initialState: AppointmentReducer = {
  entries: {},
  liveQueue: [],
  history: [],
  error: undefined,
  loading: false,
  limit: 0,
  skip: 0,
}

export default (
  state = initialState,
  action:
    | Types.QBAppointmentAction
    | Types.LogoutSuccessAction
    | Types.QBInitFailureAction,
) => {
  switch (action.type) {
    case Types.QB_APPOINTMENT_GET_REQUEST:
    case Types.QB_APPOINTMENT_UPDATE_REQUEST:
      return { ...state, error: undefined, loading: true }
    case Types.QB_APPOINTMENT_GET_SUCCESS: {
      const { limit, skip, entries, history, liveQueue, filterIds, reset } =
        action.payload

      const newState = {
        ...state,
        loading: false,
        limit,
        skip,
        entries: omit({ ...state.entries, ...entries }, filterIds),
        history: difference(
          reset === 'history' ? history : union(state.history, history),
          filterIds,
        ),
        liveQueue: difference(
          reset === 'liveQueue' ? liveQueue : union(state.liveQueue, liveQueue),
          filterIds,
        ),
      }

      const historyIntersaction = intersection(
        newState.history,
        newState.liveQueue,
      )

      newState.liveQueue = difference(newState.liveQueue, historyIntersaction)

      return newState
    }
    case Types.QB_APPOINTMENT_GET_FAILURE:
      return { ...state, loading: false, error: action.error }
    case Types.QB_APPOINTMENT_UPDATE_FAILURE: {
      const { id, code } = action.payload.data || {}

      const newState = {
        ...state,
        loading: false,
        error: action.payload.message,
      }

      if (id && code === 404) {
        newState.entries = omit(state.entries, id)
        newState.liveQueue = difference(state.liveQueue, [id])
        newState.history = difference(state.history, [id])
      }

      return newState
    }
    case Types.QB_APPOINTMENT_UPDATE_SUCCESS: {
      const { appointment, liveQueue, history, filterIds } = action.payload

      const newState = {
        ...state,
        loading: false,
        entries: { ...state.entries, [appointment._id]: appointment },
        liveQueue: union(state.liveQueue, liveQueue),
        history: union(state.history, history),
      }

      const historyIntersaction = intersection(
        newState.history,
        newState.liveQueue,
      )

      newState.liveQueue = difference(
        newState.liveQueue,
        historyIntersaction,
        filterIds,
      )

      return newState
    }
    case Types.QB_CLEAR_APPOINTMENT_OF_DELETED_USERS:
      return {
        ...state,
        entries: omit(
          state.entries,
          action.payload,
        ) as Dictionary<QBAppointment>,
        liveQueue: difference(state.liveQueue, action.payload),
        history: difference(state.history, action.payload),
      }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
