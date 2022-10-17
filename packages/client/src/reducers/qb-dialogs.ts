import * as Types from '../actions'

export interface DialogsReducer {
  entries: Dictionary<QBChatDialog>
  error?: string
  loading: boolean
}

const initialState: DialogsReducer = {
  entries: {},
  error: undefined,
  loading: false,
}

type DialogsReducerAction =
  | Types.QBDialogAction
  | Types.QBChatIncomingMessageAction
  | Types.QBMarkMessageReadAction
  | Types.QBChatMessageReadAction
  | Types.LogoutSuccessAction
  | Types.QBInitFailureAction

export default (state = initialState, action: DialogsReducerAction) => {
  switch (action.type) {
    case Types.QB_DIALOG_CREATE_REQUEST:
    case Types.QB_DIALOG_GET_REQUEST:
      return { ...state, error: undefined, loading: true }
    case Types.QB_DIALOG_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        entries: {
          ...state.entries,
          [action.payload._id]: action.payload,
        },
      }
    case Types.QB_DIALOG_GET_SUCCESS:
      return {
        ...state,
        loading: false,
        entries: {
          ...state.entries,
          ...action.payload,
        },
      }
    case Types.QB_DIALOG_CREATE_FAILURE:
    case Types.QB_DIALOG_GET_FAILURE:
      return { ...state, loading: false, error: action.error }
    case Types.QB_CHAT_MESSAGE: {
      const { message, isMine } = action.payload
      const dialog = state.entries[message.dialog_id]

      return dialog
        ? {
            ...state,
            entries: {
              ...state.entries,
              [dialog._id]: {
                ...dialog,
                unread_messages_count: isMine
                  ? dialog.unread_messages_count
                  : (dialog.unread_messages_count || 0) + 1,
              },
            },
          }
        : state
    }
    case Types.QB_CHAT_MARK_MESSAGE_READ:
    case Types.QB_CHAT_MESSAGE_READ: {
      const { dialogId } = action.payload
      const dialog = state.entries[dialogId]

      return dialog
        ? {
            ...state,
            entries: {
              ...state.entries,
              [dialog._id]: {
                ...dialog,
                unread_messages_count: dialog.unread_messages_count
                  ? dialog.unread_messages_count - 1
                  : 0,
              },
            },
          }
        : state
    }
    case Types.QB_DIALOG_JOIN_SUCCESS: {
      const dialog = state.entries[action.payload]

      return dialog
        ? {
            ...state,
            entries: {
              ...state.entries,
              [dialog._id]: {
                ...dialog,
                joined: true,
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
