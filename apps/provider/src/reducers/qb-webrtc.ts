import { QBAppointment, QBWebRTCSession } from '@qc/quickblox'
import * as Types from '../actions'

export interface CallReducer {
  callDuration: string
  muteAudio: boolean
  muteVideo: boolean
  participants: number[]
  screenshare: boolean
  appointmentId?: QBAppointment['_id']
  session?: QBWebRTCSession
  videoInputSources: MediaDeviceInfo[]
  remoteStream?: MediaStream
}

const initialState: CallReducer = {
  callDuration: '',
  muteAudio: false,
  muteVideo: false,
  participants: [],
  screenshare: false,
  appointmentId: undefined,
  session: undefined,
  videoInputSources: [],
  remoteStream: undefined,
}

export default (
  state = initialState,
  action: Types.QBWebRTCAction | Types.LogoutSuccessAction,
) => {
  switch (action.type) {
    case Types.QB_START_CALL_SUCCESS:
    case Types.QB_ACCEPT_CALL_SUCCESS:
      return {
        ...state,
        session: action.payload.session,
        appointmentId: action.payload.appointmentId,
      }
    case Types.NO_ANSWER:
    case Types.CALL_RECONNECT:
    case Types.SESSION_STATE_CHANGED:
      return {
        ...state,
        session: state.session ? action.payload.session : undefined,
      }
    case Types.TOGGLE_MUTE_AUDIO_SUCCESS:
      return { ...state, muteAudio: action.payload.muted }
    case Types.TOGGLE_MUTE_VIDEO_SUCCESS:
      return { ...state, muteVideo: action.payload.muted }
    case Types.TOGGLE_SCREENSHARE_SUCCESS:
      return { ...state, screenshare: !state.screenshare }
    case Types.GET_VIDEO_INPUT_SOURCES_SUCCESS:
      return { ...state, videoInputSources: action.payload }
    case Types.UPDATE_CALL_DURATION:
      return { ...state, callDuration: action.payload }
    case Types.REMOTE_STREAM:
      return { ...state, remoteStream: action.payload.stream }
    case Types.QB_STOP_CALL_SUCCESS:
    case Types.SESSION_CLOSE:
    case Types.CALL_REJECT:
    case Types.LOGOUT_SUCCESS:
      return {
        ...initialState,
        videoInputSources: state.videoInputSources,
      }
    default:
      return state
  }
}
