import { QBSession, QBUser } from '@qc/quickblox'
import * as Types from '../actions'

export interface AuthReducer {
  error?: string
  loading: boolean
  loggedIn: boolean
  session?: QBSession
  account?: QBUser
}

const initialState: AuthReducer = {
  error: undefined,
  loading: false,
  loggedIn: false,
  session: undefined,
  account: undefined,
}

export default (
  state = initialState,
  action: Types.AuthAction | Types.QBUserAction | Types.QBInitFailureAction,
) => {
  switch (action.type) {
    case Types.QB_LOGIN_SUCCESS:
    case Types.QB_LOGIN_BY_TOKEN_SUCCESS:
    case Types.QB_ACCOUNT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedIn: true,
        account: action.payload.user,
        session: action.payload.session,
      }
    case Types.QB_MY_ACCOUNT_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        account: { ...state.account, ...action.payload },
      }
    case Types.LOGOUT_FAILURE:
    case Types.QB_MY_ACCOUNT_UPDATE_FAILURE:
      return { ...state, error: action.error, loading: false }
    case Types.SESSION_UPDATED_AT:
      return {
        ...state,
        session: <QBSession>{
          ...state.session,
          updated_at: action.payload,
        },
      }
    case Types.CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: undefined,
      }
    case Types.QB_LOGIN_FAILURE:
    case Types.QB_LOGIN_BY_TOKEN_FAILURE:
    case Types.QB_ACCOUNT_CREATE_FAILURE:
      return {
        ...initialState,
        error: action.error,
      }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
