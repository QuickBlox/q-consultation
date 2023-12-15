import {
  QBChatDialog,
  QBChatMessage,
  QBChatNewMessage,
  QBChatXMPPMessage,
  QBMessageStatusParams,
  QBSystemMessage,
  QBUser,
} from '@qc/quickblox'
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
export const QB_GET_QUICK_ANSWER_REQUEST = 'QB_GET_QUICK_ANSWER_REQUEST'
export const QB_GET_QUICK_ANSWER_SUCCESS = 'QB_GET_QUICK_ANSWER_SUCCESS'
export const QB_GET_QUICK_ANSWER_FAILURE = 'QB_GET_QUICK_ANSWER_FAILURE'
export const QB_GET_QUICK_ANSWER_CANCEL = 'QB_GET_QUICK_ANSWER_CANCEL'
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
export interface QBGetQuickAnswerSuccessAction extends Action {
  type: typeof QB_GET_QUICK_ANSWER_SUCCESS
  payload: { answer: string }
}

export interface QBGetQuickAnswerFailureAction extends Action {
  type: typeof QB_GET_QUICK_ANSWER_FAILURE
  error: string
}

export interface QBGetQuickAnswerCancelAction extends Action {
  type: typeof QB_GET_QUICK_ANSWER_CANCEL
}

export interface QBGetQuickAnswerRequestAction extends Action {
  type: typeof QB_GET_QUICK_ANSWER_REQUEST
  payload: {
    dialogId: QBChatMessage['chat_dialog_id']
    messageId: QBChatMessage['_id']
    then?: (
      action: QBGetQuickAnswerSuccessAction | QBGetQuickAnswerFailureAction,
    ) => void
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
  | QBGetQuickAnswerSuccessAction
  | QBGetQuickAnswerFailureAction
  | QBGetQuickAnswerCancelAction
  | QBGetQuickAnswerRequestAction
