import * as Types from '../actions'

export interface UsersReducer {
  current_page: number
  error?: string
  loading: boolean
  per_page: number
  total_entries: number
  entries: Dictionary<QBUser>
  not_found: Array<QBUser['id']>
}

const initialState: UsersReducer = {
  current_page: 1,
  error: undefined,
  loading: false,
  per_page: 30,
  total_entries: 0,
  entries: {},
  not_found: [],
}

export default (
  state = initialState,
  action:
    | Types.QBUserAction
    | Types.AuthAction
    | Types.LogoutSuccessAction
    | Types.QBInitFailureAction,
) => {
  switch (action.type) {
    case Types.QB_USER_GET_REQUEST:
    case Types.QB_USER_LIST_REQUEST:
      return { ...state, error: undefined, loading: true }
    case Types.QB_USER_GET_SUCCESS: {
      const { current_page, per_page, total_entries, entries } = action.payload

      return {
        ...state,
        current_page,
        loading: false,
        per_page,
        total_entries,
        entries: {
          ...state.entries,
          ...entries,
        },
      }
    }
    case Types.QB_USER_LIST_SUCCESS: {
      const { current_page, per_page, total_entries, entries, not_found } =
        action.payload

      return {
        ...state,
        current_page,
        loading: false,
        per_page,
        total_entries,
        not_found: state.not_found.concat(not_found),
        entries: {
          ...state.entries,
          ...entries,
        },
      }
    }
    case Types.QB_LOGIN_SUCCESS: {
      const { user } = action.payload

      return {
        ...state,
        entries: {
          ...state.entries,
          [user.id]: user,
        },
        loading: false,
      }
    }
    case Types.QB_MY_ACCOUNT_UPDATE_SUCCESS:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.id]: action.payload,
        },
      }
    case Types.QB_USER_GET_FAILURE: {
      const { error, data } = action.payload
      const hideCurrentError = 'full_name' in data

      return {
        ...state,
        loading: false,
        error: hideCurrentError ? state.error : error,
      }
    }
    case Types.QB_USER_LIST_FAILURE:
    case Types.QB_USER_ERROR_RESET:
      return { ...state, error: initialState.error }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
