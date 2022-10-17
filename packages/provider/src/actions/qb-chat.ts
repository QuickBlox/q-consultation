import { Action } from 'redux'

// QB Chat module events
export const QB_CHAT_DISCONNECTED = '@QB/DISCONNECTED'
export const QB_CHAT_CONNECTED = '@QB/CONNECTED'
export const QB_CHAT_PING = '@QB/PING'

export interface QBChatDisconnectedAction extends Action {
  type: typeof QB_CHAT_DISCONNECTED
}

export interface QBChatConnectedAction extends Action {
  type: typeof QB_CHAT_CONNECTED
}

export interface QBChatPingAction extends Action {
  type: typeof QB_CHAT_PING
}

export type QBChatAction =
  | QBChatDisconnectedAction
  | QBChatConnectedAction
  | QBChatPingAction
