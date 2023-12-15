import { QBChatDialog } from '@qc/quickblox'
import { Action } from 'redux'

export const REPHRASE_REQUEST = 'REPHRASE_REQUEST'
export const REPHRASE_SUCCESS = 'REPHRASE_SUCCESS'
export const REPHRASE_FAILURE = 'REPHRASE_FAILURE'

export interface RephraseSuccessAction extends Action {
  type: typeof REPHRASE_SUCCESS
  payload: {
    rephrasedText: string
  }
}

export interface RephraseFailureAction extends Action {
  type: typeof REPHRASE_FAILURE
  error: string
}

export interface RephraseRequestAction extends Action {
  type: typeof REPHRASE_REQUEST
  payload: {
    dialogId: QBChatDialog['_id']
    text: string
    tone: string
    then?: (action: RephraseSuccessAction | RephraseFailureAction) => void
  }
}

export type RephraseAction =
  | RephraseSuccessAction
  | RephraseRequestAction
  | RephraseFailureAction
