import * as Types from '../actions'

export function getMessages(
  payload: Types.GetMessagesPayload,
): Types.QBGetMessageRequestAction {
  return { type: Types.QB_CHAT_GET_MESSAGE_REQUEST, payload }
}

export function getMessagesSuccess(payload: {
  dialogId: QBChatDialog['_id']
  skip: number
  limit: number
  entries: Dictionary<QBChatMessage>
}): Types.QBGetMessageSuccessAction {
  return { type: Types.QB_CHAT_GET_MESSAGE_SUCCESS, payload }
}

export function getMessagesFailure(
  error: string,
): Types.QBGetMessageFailureAction {
  return { type: Types.QB_CHAT_GET_MESSAGE_FAILURE, error }
}

export function sendMessage(payload: {
  dialogId: QBChatDialog['_id']
  message: QBChatNewMessage
  then?: (data: Types.QBSendMessageSuccessAction) => void
}): Types.QBSendMessageRequestAction {
  return { type: Types.QB_CHAT_SEND_MESSAGE_REQUEST, payload }
}

export function sendMessageSuccess(
  message: QBChatMessage,
): Types.QBSendMessageSuccessAction {
  return { type: Types.QB_CHAT_SEND_MESSAGE_SUCCESS, payload: message }
}

export function sendMessageFailure(
  error: string,
): Types.QBSendMessageFailureAction {
  return { type: Types.QB_CHAT_SEND_MESSAGE_FAILURE, error }
}

export function sendSystemMessage(payload: {
  dialogId: QBChatDialog['_id']
  message: { extension: QBSystemMessage['extension'] }
  then?: (data?: Types.QBSendSystemMessageSuccessAction) => void
}): Types.QBSendSystemMessageRequestAction {
  return { type: Types.QB_CHAT_SEND_SYSTEM_MESSAGE_REQUEST, payload }
}

export function sendSystemMessageSuccess(
  messageId: string,
): Types.QBSendSystemMessageSuccessAction {
  return {
    type: Types.QB_CHAT_SEND_SYSTEM_MESSAGE_SUCCESS,
    payload: messageId,
  }
}

export function sendSystemMessageFailure(
  error: string,
): Types.QBSendSystemMessageFailureAction {
  return { type: Types.QB_CHAT_SEND_SYSTEM_MESSAGE_FAILURE, error }
}

export function markMessageRead(
  payload: QBMessageStatusParams & { myAccountId: QBUser['id'] },
): Types.QBMarkMessageReadAction {
  return { type: Types.QB_CHAT_MARK_MESSAGE_READ, payload }
}

export function receivedChatMessage(payload: {
  userId: QBUser['id']
  message: QBChatXMPPMessage
  isMine: boolean
}): Types.QBChatIncomingMessageAction {
  return { type: Types.QB_CHAT_MESSAGE, payload }
}

export function receivedSystemMessage(payload: {
  message: QBSystemMessage
}): Types.QBChatIncomingSystemMessageAction {
  return { type: Types.QB_CHAT_SYSTEM_MESSAGE, payload }
}

export function messageDelivered(payload: {
  messageId: QBChatMessage['_id']
  dialogId: QBChatDialog['_id']
  userId: QBUser['id']
}): Types.QBChatMessageDeliveredAction {
  return { type: Types.QB_CHAT_MESSAGE_DELIVERED, payload }
}

export function messageRead(payload: {
  messageId: QBChatMessage['_id']
  dialogId: QBChatDialog['_id']
  userId: QBUser['id']
}): Types.QBChatMessageReadAction {
  return { type: Types.QB_CHAT_MESSAGE_READ, payload }
}

export function userIsTyping(payload: {
  isTyping: boolean
  userId: QBUser['id']
  dialogId: QBChatDialog['_id']
}): Types.QBChatUserTypingAction {
  return { type: Types.QB_CHAT_USER_TYPING, payload }
}

export function getQuickAnswer(
  dialogId: QBChatMessage['chat_dialog_id'],
  messageId: QBChatMessage['_id'],
  then?: (
    action:
      | Types.QBGetQuickAnswerSuccessAction
      | Types.QBGetQuickAnswerFailureAction,
  ) => void,
): Types.QBGetQuickAnswerRequestAction {
  return {
    type: Types.QB_GET_QUICK_ANSWER_REQUEST,
    payload: {
      dialogId,
      messageId,
      then,
    },
  }
}

export function getQuickAnswerSuccess(
  payload: Types.QBGetQuickAnswerSuccessAction['payload'],
): Types.QBGetQuickAnswerSuccessAction {
  return { type: Types.QB_GET_QUICK_ANSWER_SUCCESS, payload }
}

export function getQuickAnswerFailure(
  error: string,
): Types.QBGetQuickAnswerFailureAction {
  return { type: Types.QB_GET_QUICK_ANSWER_FAILURE, error }
}

export function getQuickAnswerCancel(): Types.QBGetQuickAnswerCancelAction {
  return { type: Types.QB_GET_QUICK_ANSWER_CANCEL }
}
