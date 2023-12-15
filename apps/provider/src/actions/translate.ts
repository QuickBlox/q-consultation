import { QBChatDialog, QBChatMessage } from '@qc/quickblox'
import { Action } from 'redux'

export const GET_TRANSLATE_REQUEST = 'GET_TRANSLATE_REQUEST'
export const GET_TRANSLATE_SUCCESS = 'GET_TRANSLATE_SUCCESS'
export const GET_TRANSLATE_FAILURE = 'GET_TRANSLATE_FAILURE'

export interface GetTranslateSuccessAction extends Action {
  type: typeof GET_TRANSLATE_SUCCESS
  payload: {
    dialogId: QBChatDialog['_id']
    messageId: QBChatMessage['_id']
    translatedMessage: string
  }
}

export interface GetTranslateFailureAction extends Action {
  type: typeof GET_TRANSLATE_FAILURE
  payload: { messageId: QBChatMessage['_id'] }
  error: string
}

export interface GetTranslateRequestAction extends Action {
  type: typeof GET_TRANSLATE_REQUEST
  payload: {
    dialogId: QBChatDialog['_id']
    messageId: QBChatMessage['_id']
    language: string
    then?: (
      action: GetTranslateSuccessAction | GetTranslateFailureAction,
    ) => void
  }
}

export type TranslateAction =
  | GetTranslateSuccessAction
  | GetTranslateRequestAction
  | GetTranslateFailureAction
