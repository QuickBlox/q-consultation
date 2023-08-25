import * as Types from '../actions'

export interface ChatReducer {
  connected: boolean
}

const initialState: ChatReducer = {
  connected: false,
}

export default (
  state = initialState,
  action:
    | Types.QBChatAction
    | Types.QBMessageAction
    | Types.QBLoginSuccessAction
    | Types.LogoutSuccessAction
    | Types.QBInitFailureAction,
) => {
  switch (action.type) {
    case Types.QB_LOGIN_SUCCESS:
    case Types.QB_CHAT_CONNECTED:
    case Types.QB_CHAT_MESSAGE:
    case Types.QB_CHAT_SYSTEM_MESSAGE:
    case Types.QB_CHAT_MESSAGE_READ:
    case Types.QB_CHAT_USER_TYPING:
      return {
        ...state,
        connected: true,
      }
    case Types.QB_CHAT_DISCONNECTED:
      return {
        ...state,
        connected: false,
      }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
