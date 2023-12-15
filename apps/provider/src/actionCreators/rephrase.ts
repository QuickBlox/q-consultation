import { QBChatDialog } from '@qc/quickblox'
import * as Types from '../actions'

export function rephrase(
  data: {
    dialogId: QBChatDialog['_id']
    text: string
    tone: string
  },
  then?: (
    action: Types.RephraseSuccessAction | Types.RephraseFailureAction,
  ) => void,
): Types.RephraseRequestAction {
  return { type: Types.REPHRASE_REQUEST, payload: { ...data, then } }
}

export function rephraseSuccess(
  payload: Types.RephraseSuccessAction['payload'],
): Types.RephraseSuccessAction {
  return { type: Types.REPHRASE_SUCCESS, payload }
}

export function rephraseFailure(error: string): Types.RephraseFailureAction {
  return { type: Types.REPHRASE_FAILURE, error }
}
