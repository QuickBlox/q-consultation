import { QBChatDialog, QBChatMessage } from '@qc/quickblox'
import * as Types from '../actions'

export function getTranslate(
  data: {
    dialogId: QBChatDialog['_id']
    messageId: QBChatMessage['_id']
    language: string
  },
  then?: (
    action: Types.GetTranslateSuccessAction | Types.GetTranslateFailureAction,
  ) => void,
): Types.GetTranslateRequestAction {
  return { type: Types.GET_TRANSLATE_REQUEST, payload: { ...data, then } }
}

export function getTranslateSuccess(
  payload: Types.GetTranslateSuccessAction['payload'],
): Types.GetTranslateSuccessAction {
  return { type: Types.GET_TRANSLATE_SUCCESS, payload }
}

export function getTranslateFailure(
  messageId: QBChatMessage['_id'],
  error: string,
): Types.GetTranslateFailureAction {
  return { type: Types.GET_TRANSLATE_FAILURE, payload: { messageId }, error }
}
