import { QBChatXMPPMessage } from '@qc/quickblox'
import * as Types from '../actions'

export interface ChatReducer {
  connected: boolean
  lastReceivedMessageId?: QBChatXMPPMessage['id']
}

const initialState: ChatReducer = {
  connected: false,
  lastReceivedMessageId: undefined,
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
    case Types.QB_CHAT_MESSAGE_READ:
    case Types.QB_CHAT_USER_TYPING:
      return {
        ...state,
        connected: true,
      }
    case Types.QB_CHAT_MESSAGE:
      return {
        ...state,
        connected: true,
        lastReceivedMessageId: action.payload.isMine
          ? state.lastReceivedMessageId
          : action.payload.message.id,
      }
    case Types.QB_CHAT_SYSTEM_MESSAGE:
      return action.payload.message?.extension?.notification_type === 'DIALOG'
        ? {
            ...state,
            connected: true,
            lastReceivedMessageId: action.payload.message.id,
          }
        : {
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
