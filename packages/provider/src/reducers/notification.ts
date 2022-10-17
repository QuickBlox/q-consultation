import * as Types from '../actions'

export type NotificationReducer = Types.Notification[]

const initialState: NotificationReducer = []

export default (
  state = initialState,
  action:
    | Types.NotificationAction
    | Types.LogoutSuccessAction
    | Types.QBInitFailureAction,
) => {
  switch (action.type) {
    case Types.SHOW_NOTIFICATION:
      return state.concat(action.payload)
    case Types.HIDE_NOTIFICATION:
      return state.filter((item) => item.id !== action.payload)
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
