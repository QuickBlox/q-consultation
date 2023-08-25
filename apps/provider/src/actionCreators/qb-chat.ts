import * as Types from '../actions'

export function chatDisconnected(): Types.QBChatDisconnectedAction {
  return { type: Types.QB_CHAT_DISCONNECTED }
}

export function chatConnected(): Types.QBChatConnectedAction {
  return { type: Types.QB_CHAT_CONNECTED }
}

export function chatPing(): Types.QBChatPingAction {
  return { type: Types.QB_CHAT_PING }
}
