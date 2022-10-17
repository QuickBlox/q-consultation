import { Action } from 'redux'

export const QB_CHAT_GET_MESSAGE_REQUEST = 'QB_CHAT_GET_MESSAGE_REQUEST'
export const QB_CHAT_GET_MESSAGE_SUCCESS = 'QB_CHAT_GET_MESSAGE_SUCCESS'
export const QB_CHAT_GET_MESSAGE_FAILURE = 'QB_CHAT_GET_MESSAGE_FAILURE'
export const QB_CHAT_SEND_MESSAGE_REQUEST = 'QB_CHAT_SEND_MESSAGE_REQUEST'
export const QB_CHAT_SEND_MESSAGE_SUCCESS = 'QB_CHAT_SEND_MESSAGE_SUCCESS'
export const QB_CHAT_SEND_MESSAGE_FAILURE = 'QB_CHAT_SEND_MESSAGE_FAILURE'
export const QB_CHAT_SEND_SYSTEM_MESSAGE_REQUEST =
  'QB_CHAT_SEND_SYSTEM_MESSAGE_REQUEST'
export const QB_CHAT_SEND_SYSTEM_MESSAGE_SUCCESS =
  'QB_CHAT_SEND_SYSTEM_MESSAGE_SUCCESS'
export const QB_CHAT_SEND_SYSTEM_MESSAGE_FAILURE =
  'QB_CHAT_SEND_SYSTEM_MESSAGE_FAILURE'
export const QB_CHAT_MARK_MESSAGE_READ = 'QB_CHAT_MARK_MESSAGE_READ'
// QB Chat module events
export const QB_CHAT_MESSAGE = '@QB/MESSAGE'
export const QB_CHAT_SYSTEM_MESSAGE = '@QB/SYSTEM_MESSAGE'
export const QB_CHAT_MESSAGE_DELIVERED = '@QB/MESSAGE_DELIVERED'
export const QB_CHAT_MESSAGE_READ = '@QB/MESSAGE_READ'
export const QB_CHAT_USER_TYPING = '@QB/TYPING'

export interface GetMessagesPayload {
  dialogId: QBChatDialog['_id']
  limit: number
  skip?: number
  then?: () => void
}

export interface QBGetMessageRequestAction extends Action {
  type: typeof QB_CHAT_GET_MESSAGE_REQUEST
  payload: GetMessagesPayload
}

export interface GetMessagesResponse {
  dialogId: QBChatDialog['_id']
  items: QBChatMessage[]
  limit: number
  skip: number
}

export interface QBGetMessageSuccessAction extends Action {
  type: typeof QB_CHAT_GET_MESSAGE_SUCCESS
  payload: {
    skip: number
    limit: number
    dialogId: QBChatDialog['_id']
    entries: Dictionary<QBChatMessage>
  }
}

export interface QBGetMessageFailureAction extends Action {
  type: typeof QB_CHAT_GET_MESSAGE_FAILURE
  error: string
}

export interface QBSendMessageSuccessAction extends Action {
  type: typeof QB_CHAT_SEND_MESSAGE_SUCCESS
  payload: QBChatMessage
}

export interface QBSendMessageRequestAction extends Action {
  type: typeof QB_CHAT_SEND_MESSAGE_REQUEST
  payload: {
    dialogId: QBChatDialog['_id']
    message: QBChatNewMessage
    then?: (data: QBSendMessageSuccessAction) => void
  }
}
export interface QBSendMessageFailureAction extends Action {
  type: typeof QB_CHAT_SEND_MESSAGE_FAILURE
  error: string
}

export interface QBSendSystemMessageSuccessAction extends Action {
  type: typeof QB_CHAT_SEND_SYSTEM_MESSAGE_SUCCESS
  payload: string
}

export interface QBSendSystemMessageRequestAction extends Action {
  type: typeof QB_CHAT_SEND_SYSTEM_MESSAGE_REQUEST
  payload: {
    dialogId: QBChatDialog['_id']
    message: { extension: QBSystemMessage['extension'] }
    then?: (data: QBSendSystemMessageSuccessAction) => void
  }
}

export interface QBSendSystemMessageFailureAction extends Action {
  type: typeof QB_CHAT_SEND_SYSTEM_MESSAGE_FAILURE
  error: string
}

export interface QBMarkMessageReadAction extends Action {
  type: typeof QB_CHAT_MARK_MESSAGE_READ
  payload: QBMessageStatusParams & { myAccountId: QBUser['id'] }
}

export interface QBChatIncomingMessageAction extends Action {
  type: typeof QB_CHAT_MESSAGE
  payload: {
    userId: QBUser['id']
    message: QBChatXMPPMessage
    isMine: boolean
  }
}

export interface QBChatIncomingSystemMessageAction extends Action {
  type: typeof QB_CHAT_SYSTEM_MESSAGE
  payload: { message: QBSystemMessage }
}

export interface QBChatMessageDeliveredAction extends Action {
  type: typeof QB_CHAT_MESSAGE_DELIVERED
  payload: {
    messageId: QBChatMessage['_id']
    dialogId: QBChatDialog['_id']
    userId: QBUser['id']
  }
}

export interface QBChatMessageReadAction extends Action {
  type: typeof QB_CHAT_MESSAGE_READ
  payload: {
    messageId: QBChatMessage['_id']
    dialogId: QBChatDialog['_id']
    userId: QBUser['id']
  }
}

export interface QBChatUserTypingAction extends Action {
  type: typeof QB_CHAT_USER_TYPING
  payload: {
    isTyping: boolean
    userId: QBUser['id']
    dialogId: QBChatDialog['_id']
  }
}

export type QBMessageAction =
  | QBGetMessageRequestAction
  | QBGetMessageSuccessAction
  | QBGetMessageFailureAction
  | QBSendMessageRequestAction
  | QBSendMessageSuccessAction
  | QBSendMessageFailureAction
  | QBSendSystemMessageRequestAction
  | QBSendSystemMessageSuccessAction
  | QBSendSystemMessageFailureAction
  | QBMarkMessageReadAction
  | QBChatIncomingMessageAction
  | QBChatIncomingSystemMessageAction
  | QBChatMessageDeliveredAction
  | QBChatMessageReadAction
  | QBChatUserTypingAction
