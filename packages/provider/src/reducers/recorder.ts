import * as Types from '../actions'

export interface RecorderReducer {
  recording: boolean
  records: Dictionary<QBContentObject>
}

const initialState: RecorderReducer = {
  recording: false,
  records: {},
}

export default (
  state = initialState,
  action:
    | Types.RecorderAction
    | Types.LogoutSuccessAction
    | Types.QBInitFailureAction,
) => {
  switch (action.type) {
    case Types.RECORD_START_SUCCESS:
      return { ...state, recording: true }
    case Types.RECORD_STOP_SUCCESS:
      return { ...state, recording: false }
    case Types.GET_RECORDS_SUCCESS:
      return {
        ...state,
        records: {
          ...state.records,
          ...action.payload,
        },
      }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
