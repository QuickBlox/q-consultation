import omit from 'lodash/omit'

import * as Types from '../actions'

export interface AppointmentReducer {
  entries: Dictionary<QBAppointment>
  error?: string
  loading: boolean
  limit: number
  skip: number
}

const initialState: AppointmentReducer = {
  entries: {},
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
    case Types.QB_APPOINTMENT_CREATE_REQUEST:
    case Types.QB_APPOINTMENT_UPDATE_REQUEST:
      return { ...state, error: undefined, loading: true }
    case Types.QB_APPOINTMENT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        entries: {
          ...state.entries,
          [action.payload._id]: action.payload,
        },
      }
    case Types.QB_APPOINTMENT_GET_SUCCESS:
      return {
        ...state,
        loading: false,
        limit: action.payload.limit,
        skip: action.payload.skip,
        entries: { ...state.entries, ...action.payload.entries },
      }
    case Types.QB_APPOINTMENT_GET_FAILURE:
    case Types.QB_APPOINTMENT_CREATE_FAILURE:
    case Types.QB_APPOINTMENT_UPDATE_FAILURE:
      return { ...state, loading: false, error: action.error }
    case Types.QB_APPOINTMENT_UPDATE_SUCCESS: {
      const { appointment } = action.payload

      return {
        ...state,
        loading: false,
        entries: { ...state.entries, [appointment._id]: appointment },
      }
    }
    case Types.QB_CLEAR_APPOINTMENT_OF_DELETED_USERS:
      return {
        ...state,
        entries: omit(
          state.entries,
          action.payload,
        ) as Dictionary<QBAppointment>,
      }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
