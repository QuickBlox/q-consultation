import { QBChatMessage } from '@qc/quickblox'
import omit from 'lodash/omit'
import * as Types from '../actions'

type Dialogs = Dictionary<{
  entries: Dictionary<QBChatMessage>
  limit: number
  skip: number
}>

export interface MessagesReducer {
  error?: string
  loading: boolean
  loadMessageId: QBChatMessage['_id'] | null
  dialogs: Dialogs
}

const initialState: MessagesReducer = {
  error: undefined,
  loading: false,
  loadMessageId: null,
  dialogs: {},
}

function isReceivedReadMessageAction(
  action: Types.QBChatMessageReadAction | Types.QBMarkMessageReadAction,
): action is Types.QBChatMessageReadAction {
  return action.type === Types.QB_CHAT_MESSAGE_READ
}

type ActionType =
  | Types.QBMessageAction
  | Types.QBContentAction
  | Types.QBDialogLeaveSuccessAction
  | Types.LogoutSuccessAction
  | Types.QBInitFailureAction

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case Types.QB_CHAT_GET_MESSAGE_REQUEST:
    case Types.QB_CHAT_SEND_MESSAGE_REQUEST:
    case Types.QB_CHAT_SEND_SYSTEM_MESSAGE_REQUEST:
    case Types.QB_FILE_UPLOAD_REQUEST:
      return { ...state, error: undefined, loading: true }
    case Types.QB_CHAT_GET_MESSAGE_SUCCESS: {
      const { dialogId, entries, skip, limit } = action.payload
      const dialog = state.dialogs[dialogId] || {}

      return {
        ...state,
        loading: false,
        dialogs: {
          ...state.dialogs,
          [dialogId]: {
            skip,
            limit,
            entries: dialog.entries
              ? {
                  ...dialog.entries,
                  ...entries,
                }
              : entries,
          },
        },
      }
    }
    case Types.QB_CHAT_SEND_MESSAGE_SUCCESS: {
      const message = action.payload
      const dialog = state.dialogs[message.chat_dialog_id] || {}
      const newEntries = { [message._id]: message }

      return {
        ...state,
        loading: false,
        dialogs: {
          ...state.dialogs,
          [message.chat_dialog_id]: {
            ...dialog,
            entries: dialog.entries
              ? {
                  ...dialog.entries,
                  ...newEntries,
                }
              : newEntries,
          },
        },
      }
    }
    case Types.QB_GET_QUICK_ANSWER_REQUEST:
      return {
        ...state,
        loadMessageId: action.payload.messageId,
      }
    case Types.QB_GET_QUICK_ANSWER_SUCCESS:
    case Types.QB_GET_QUICK_ANSWER_FAILURE:
    case Types.QB_GET_QUICK_ANSWER_CANCEL:
      return {
        ...state,
        loadMessageId: null,
      }
    case Types.QB_CHAT_SEND_SYSTEM_MESSAGE_SUCCESS:
    case Types.QB_FILE_UPLOAD_SUCCESS:
    case Types.QB_FILE_UPLOAD_CANCEL:
      return { ...state, loading: false }
    case Types.QB_CHAT_GET_MESSAGE_FAILURE:
    case Types.QB_CHAT_SEND_MESSAGE_FAILURE:
    case Types.QB_CHAT_SEND_SYSTEM_MESSAGE_FAILURE:
    case Types.QB_FILE_UPLOAD_FAILURE:
      return { ...state, loading: false, error: action.error }
    case Types.QB_CHAT_MESSAGE: {
      const { message, userId } = action.payload
      const { attachments = [], date_sent: date_sent_string } =
        message?.extension || {}
      const date_sent = parseInt(date_sent_string, 10)
      const dateString = new Date(date_sent * 1000).toISOString()
      const newMessage: QBChatMessage = {
        _id: message.id,
        attachments,
        chat_dialog_id: message.dialog_id,
        created_at: dateString,
        date_sent,
        delivered_ids: [userId],
        message: message.body,
        read_ids: [userId],
        read: 0,
        recipient_id: null,
        sender_id: userId,
        updated_at: dateString,
      }
      const dialog = state.dialogs[newMessage.chat_dialog_id] || {}
      const newEntries = { [newMessage._id]: newMessage }

      return {
        ...state,
        loading: false,
        dialogs: {
          ...state.dialogs,
          [newMessage.chat_dialog_id]: {
            ...dialog,
            entries: dialog.entries
              ? {
                  ...dialog.entries,
                  ...newEntries,
                }
              : newEntries,
          },
        },
      }
    }
    case Types.QB_DIALOG_LEAVE_SUCCESS: {
      return {
        ...state,
        dialogs: omit(state.dialogs, action.payload) as Dialogs,
      }
    }
    case Types.QB_CHAT_MARK_MESSAGE_READ:
    case Types.QB_CHAT_MESSAGE_READ: {
      const { dialogId, messageId } = action.payload
      const dialog = state.dialogs[dialogId]
      const currentMessage = dialog?.entries?.[messageId]
      const userId = isReceivedReadMessageAction(action)
        ? action.payload.userId
        : action.payload.myAccountId

      return currentMessage
        ? {
            ...state,
            dialogs: {
              ...state.dialogs,
              [currentMessage.chat_dialog_id]: {
                ...dialog,
                entries: {
                  ...dialog.entries,
                  [currentMessage._id]: {
                    ...currentMessage,
                    read_ids: currentMessage.read_ids
                      ? [...currentMessage.read_ids, userId]
                      : [userId],
                  },
                },
              },
            },
          }
        : state
    }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
