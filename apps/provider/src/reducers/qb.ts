import * as Types from '../actions'

export interface QBReducer {
  error?: string
  loading: boolean
  ready: boolean
}

const initialState: QBReducer = {
  error: undefined,
  loading: false,
  ready: false,
}

export default (
  state = initialState,
  action: Types.QBAction | Types.LogoutSuccessAction,
) => {
  switch (action.type) {
    case Types.QB_INIT_REQUEST:
      return { ...state, error: undefined, loading: true }
    case Types.QB_INIT_SUCCESS:
      return { ...state, loading: false, ready: true }
    case Types.QB_INIT_FAILURE:
      return { ...state, loading: false, error: action.error }
    case Types.LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
