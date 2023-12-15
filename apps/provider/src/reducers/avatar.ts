import * as Types from '../actions'

interface Avatar {
  loading: boolean
  blob?: Blob
  error?: string
}

export interface AvatarReducer {
  myAvatar?: Avatar
  entries: Dictionary<Avatar>
}

const initialState: AvatarReducer = {
  entries: {},
}

export default (
  state = initialState,
  action: Types.AvatarAction | Types.LogoutSuccessAction,
) => {
  switch (action.type) {
    case Types.GET_USER_AVATAR_REQUEST: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { then, ...avatar } = action.payload

      return {
        ...state,
        entries: {
          ...state.entries,
          [avatar.userId]: {
            ...avatar,
            loading: true,
            error: undefined,
          },
        },
      }
    }
    case Types.GET_USER_AVATAR_SUCCESS:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.userId]: {
            ...state.entries[action.payload.userId],
            ...action.payload,
            loading: false,
            error: undefined,
          },
        },
      }
    case Types.GET_USER_AVATAR_FAILURE:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.userId]: {
            ...state.entries[action.payload.userId],
            loading: false,
            error: action.error,
          },
        },
      }
    case Types.GET_MY_AVATAR_REQUEST:
    case Types.SET_MY_AVATAR_REQUEST:
    case Types.DELETE_MY_AVATAR_REQUEST:
      return {
        ...state,
        myAvatar: {
          ...(state.myAvatar || {}),
          loading: true,
        },
      }
    case Types.GET_MY_AVATAR_SUCCESS:
    case Types.SET_MY_AVATAR_SUCCESS:
      return {
        ...state,
        myAvatar: {
          loading: false,
          blob: action.payload.blob,
        },
      }
    case Types.DELETE_MY_AVATAR_SUCCESS:
      return {
        ...state,
        myAvatar: {
          loading: false,
        },
      }
    case Types.GET_MY_AVATAR_FAILURE:
    case Types.SET_MY_AVATAR_FAILURE:
    case Types.DELETE_MY_AVATAR_FAILURE:
      return {
        ...state,
        myAvatar: {
          ...(state.myAvatar || {}),
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
