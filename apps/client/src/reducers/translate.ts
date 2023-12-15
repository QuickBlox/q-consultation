import { QBChatDialog, QBChatMessage } from '@qc/quickblox'
import * as Types from '../actions'

export type Translate = Dictionary<{
  language: string
  dialogId: QBChatDialog['_id']
  messageId: QBChatMessage['_id']
  translatedMessage: string
  loading: boolean
  error?: string
}>

const initialState: Translate = {}

export default (
  state = initialState,
  action: Types.TranslateAction | Types.LogoutSuccessAction,
) => {
  switch (action.type) {
    case Types.GET_TRANSLATE_REQUEST: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { then, ...message } = action.payload

      return {
        ...state,
        [message.messageId]: {
          ...message,
          translatedMessage: '',
          loading: true,
          error: undefined,
        },
      }
    }
    case Types.GET_TRANSLATE_SUCCESS:
      return {
        ...state,
        [action.payload.messageId]: {
          ...state[action.payload.messageId],
          ...action.payload,
          loading: false,
          error: undefined,
        },
      }
    case Types.GET_TRANSLATE_FAILURE:
      return {
        ...state,
        [action.payload.messageId]: {
          ...state[action.payload.messageId],
          loading: false,
          error: action.error,
        },
      }
    case Types.LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
