import * as Types from '../actions'

export interface QBReducer {
  error?: string
  loading: boolean
  ready: boolean
  online: boolean
  providerId?: QBUser['id']
}

const initialState: QBReducer = {
  error: undefined,
  loading: false,
  ready: false,
  online: true,
  providerId: undefined,
}

export default (
  state = initialState,
  action:
    | Types.QBAction
    | Types.LogoutSuccessAction
    | Types.QBEmailLoginRequestAction,
) => {
  switch (action.type) {
    case Types.QB_SELECT_PROVIDER:
      return { ...state, providerId: action.payload }
    case Types.QB_INIT_REQUEST:
      return { ...state, loading: true }
    case Types.QB_INIT_SUCCESS:
      return { ...state, loading: false, ready: true }
    case Types.QB_INIT_FAILURE:
      return { ...state, loading: false, error: action.error }
    case Types.QB_LOGIN_REQUEST:
      return { ...state, error: undefined }
    case Types.LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
