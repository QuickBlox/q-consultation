import { QBChatDialog } from '@qc/quickblox'
import * as Types from '../actions'

export interface Rephrase {
  error?: string
  loading: boolean
  dialogId?: QBChatDialog['_id']
  originalText: string
  rephrasedText: string
}

const initialState: Rephrase = {
  error: undefined,
  loading: false,
  dialogId: undefined,
  originalText: '',
  rephrasedText: '',
}

export default (
  state = initialState,
  action: Types.RephraseAction | Types.LogoutSuccessAction,
) => {
  switch (action.type) {
    case Types.REPHRASE_REQUEST:
      return {
        ...state,
        error: undefined,
        loading: true,
        dialogId: action.payload.dialogId,
        originalText: action.payload.text,
      }
    case Types.REPHRASE_SUCCESS:
      return {
        ...state,
        loading: false,
        rephrasedText: action.payload.rephrasedText,
      }
    case Types.REPHRASE_FAILURE:
      return { ...state, loading: false, error: action.error }
    case Types.LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
