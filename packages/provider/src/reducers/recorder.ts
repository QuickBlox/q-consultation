import union from 'lodash/union'
import * as Types from '../actions'

export interface RecorderReducer {
  recording: boolean
  loading: boolean
  entries: Dictionary<QBRecord>
  records: Dictionary<Array<QBRecord['_id']>>
  progress: number | null
}

const initialState: RecorderReducer = {
  recording: false,
  loading: false,
  entries: {},
  records: {},
  progress: null,
}

export default (
  state = initialState,
  action:
    | Types.RecorderAction
    | Types.LogoutSuccessAction
    | Types.QBInitFailureAction,
) => {
  switch (action.type) {
    case Types.GET_RECORDS_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case Types.UPLOAD_RECORD_REQUEST:
      return {
        ...state,
        loading: true,
        progress: 0,
      }
    case Types.RECORD_START_SUCCESS:
      return { ...state, recording: true }
    case Types.RECORD_STOP_SUCCESS:
      return { ...state, recording: false }
    case Types.GET_RECORDS_SUCCESS: {
      const { appointmentId, entries, list } = action.payload
      const currentRecords = state.records?.[appointmentId]

      return {
        ...state,
        loading: false,
        entries: {
          ...state.entries,
          ...entries,
        },
        records: {
          ...state.records,
          [appointmentId]: currentRecords?.length
            ? union(currentRecords, list)
            : list,
        },
      }
    }
    case Types.UPLOAD_RECORD_SUCCESS: {
      if (action.payload) {
        const { _id, appointment_id } = action.payload
        const currentRecords = state.records?.[appointment_id]

        return {
          ...state,
          loading: false,
          progress: null,
          entries: {
            ...state.entries,
            [_id]: action.payload,
          },
          records: {
            ...state.records,
            [appointment_id]: currentRecords
              ? [...currentRecords, action.payload._id]
              : [action.payload._id],
          },
        }
      }

      return {
        ...state,
        loading: false,
        progress: null,
      }
    }
    case Types.UPLOAD_RECORD_PROGRESS:
      return {
        ...state,
        progress: action.payload,
      }
    case Types.GET_RECORDS_FAILURE:
    case Types.UPLOAD_RECORD_FAILURE:
      return {
        ...state,
        loading: false,
        progress: null,
      }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
