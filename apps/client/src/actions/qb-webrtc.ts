import { QBAppointment, QBWebRTCSession } from '@qc/quickblox'
import { Action } from 'redux'

// QuickBlox SDK WebRTC module actions
export const QB_ACCEPT_CALL_REQUEST = 'QB_ACCEPT_CALL_REQUEST'
export const QB_ACCEPT_CALL_SUCCESS = 'QB_ACCEPT_CALL_SUCCESS'
export const QB_ACCEPT_CALL_FAILURE = 'QB_ACCEPT_CALL_FAILURE'
export const QB_STOP_CALL_REQUEST = 'QB_STOP_CALL_REQUEST'
export const QB_STOP_CALL_SUCCESS = 'QB_STOP_CALL_SUCCESS'
export const QB_STOP_CALL_FAILURE = 'QB_STOP_CALL_FAILURE'
export const QB_REJECT_CALL_REQUEST = 'QB_REJECT_CALL_REQUEST'
export const QB_REJECT_CALL_SUCCESS = 'QB_REJECT_CALL_SUCCESS'
export const QB_REJECT_CALL_FAILURE = 'QB_REJECT_CALL_FAILURE'
export const TOGGLE_MUTE_AUDIO_REQUEST = 'TOGGLE_MUTE_AUDIO_REQUEST'
export const TOGGLE_MUTE_AUDIO_SUCCESS = 'TOGGLE_MUTE_AUDIO_SUCCESS'
export const TOGGLE_MUTE_AUDIO_FAILURE = 'TOGGLE_MUTE_AUDIO_FAILURE'
export const TOGGLE_MUTE_VIDEO_REQUEST = 'TOGGLE_MUTE_VIDEO_REQUEST'
export const TOGGLE_MUTE_VIDEO_SUCCESS = 'TOGGLE_MUTE_VIDEO_SUCCESS'
export const TOGGLE_MUTE_VIDEO_FAILURE = 'TOGGLE_MUTE_VIDEO_FAILURE'
export const TOGGLE_SCREENSHARE_REQUEST = 'TOGGLE_SCREENSHARE_REQUEST'
export const TOGGLE_SCREENSHARE_SUCCESS = 'TOGGLE_SCREENSHARE_SUCCESS'
export const TOGGLE_SCREENSHARE_FAILURE = 'TOGGLE_SCREENSHARE_FAILURE'
export const GET_VIDEO_INPUT_SOURCES_REQUEST = 'GET_VIDEO_INPUT_SOURCES_REQUEST'
export const GET_VIDEO_INPUT_SOURCES_SUCCESS = 'GET_VIDEO_INPUT_SOURCES_SUCCESS'
export const GET_VIDEO_INPUT_SOURCES_FAILURE = 'GET_VIDEO_INPUT_SOURCES_FAILURE'
export const SWITCH_CAMERA_REQUEST = 'SWITCH_CAMERA_REQUEST'
export const SWITCH_CAMERA_SUCCESS = 'SWITCH_CAMERA_SUCCESS'
export const SWITCH_CAMERA_FAILURE = 'SWITCH_CAMERA_FAILURE'
export const UPDATE_CALL_DURATION = 'UPDATE_CALL_DURATION'
// QuickBlox SDK WebRTC module events
export const CALL = '@QB/CALL'
export const CALL_ACCEPT = '@QB/CALL_ACCEPT'
export const CALL_REJECT = '@QB/CALL_REJECT'
export const CALL_STOP = '@QB/CALL_STOP'
export const CALL_STATS = '@QB/CALL_STATS'
export const REMOTE_STREAM = '@QB/REMOTE_STREAM'
export const NO_ANSWER = '@QB/NO_ANSWER'
export const SESSION_STATE_CHANGED = '@QB/SESSION_STATE_CHANGED'
export const CALL_RECONNECT = '@QB/CALL_RECONNECT'
export const SESSION_CLOSE = '@QB/SESSION_CLOSE'

export interface QBAcceptCallRequestAction extends Action {
  type: typeof QB_ACCEPT_CALL_REQUEST
  payload: {
    session: QBWebRTCSession
    appointmentId: QBAppointment['_id']
    start: number
  }
}

export interface QBAcceptCallSuccessAction extends Action {
  type: typeof QB_ACCEPT_CALL_SUCCESS
  payload: {
    session: QBWebRTCSession
    appointmentId: QBAppointment['_id']
  }
}

export interface QBAcceptCallFailureAction extends Action {
  type: typeof QB_ACCEPT_CALL_FAILURE
  error: string
}

export interface QBStopCallSuccessAction extends Action {
  type: typeof QB_STOP_CALL_SUCCESS
}

export interface QBStopCallRequestAction extends Action {
  type: typeof QB_STOP_CALL_REQUEST
  payload: { then?: (data: QBStopCallSuccessAction) => void }
}

export interface QBStopCallFailureAction extends Action {
  type: typeof QB_STOP_CALL_FAILURE
  error: string
}

export interface QBRejectCallRequestAction extends Action {
  type: typeof QB_REJECT_CALL_REQUEST
  payload: { session: QBWebRTCSession; reason: string }
}

export interface QBRejectCallSuccessAction extends Action {
  type: typeof QB_REJECT_CALL_SUCCESS
}

export interface QBRejectCallFailureAction extends Action {
  type: typeof QB_REJECT_CALL_FAILURE
  error: string
}

export interface ToggleMuteAudioRequestAction extends Action {
  type: typeof TOGGLE_MUTE_AUDIO_REQUEST
}

export interface ToggleMuteAudioSuccessAction extends Action {
  type: typeof TOGGLE_MUTE_AUDIO_SUCCESS
  payload: { muted: boolean }
}

export interface ToggleMuteAudioFailureAction extends Action {
  type: typeof TOGGLE_MUTE_AUDIO_FAILURE
  error: string
}

export interface ToggleMuteVideoRequestAction extends Action {
  type: typeof TOGGLE_MUTE_VIDEO_REQUEST
}

export interface ToggleMuteVideoSuccessAction extends Action {
  type: typeof TOGGLE_MUTE_VIDEO_SUCCESS
  payload: { muted: boolean }
}

export interface ToggleMuteVideoFailureAction extends Action {
  type: typeof TOGGLE_MUTE_VIDEO_FAILURE
  error: string
}

export interface ToggleScreenSharingRequestAction extends Action {
  type: typeof TOGGLE_SCREENSHARE_REQUEST
}

export interface ToggleScreenSharingSuccessAction extends Action {
  type: typeof TOGGLE_SCREENSHARE_SUCCESS
}

export interface ToggleScreenSharingFailureAction extends Action {
  type: typeof TOGGLE_SCREENSHARE_FAILURE
  error: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UserInfo = Dictionary<any>

// QB events
export interface CallRequestEvent extends Action {
  type: typeof CALL
  payload: {
    session: QBWebRTCSession
    userInfo?: UserInfo
  }
}

export interface CallAcceptedEvent extends Action {
  type: typeof CALL_ACCEPT
  payload: { session: QBWebRTCSession; userId: number; userInfo: UserInfo }
}

export interface CallRejectedEvent extends Action {
  type: typeof CALL_REJECT
  payload: { session: QBWebRTCSession; userId: number; userInfo: UserInfo }
}

export interface CallStoppedEvent extends Action {
  type: typeof CALL_STOP
  payload: { session: QBWebRTCSession; userId: number; userInfo: UserInfo }
}

export interface CallStatsEvent extends Action {
  type: typeof CALL_STATS
  payload: { session: QBWebRTCSession; userId: number; stats: string[] }
}

export interface RemoteStreamEvent extends Action {
  type: typeof REMOTE_STREAM
  payload: { session: QBWebRTCSession; userId: number; stream: MediaStream }
}

export interface SessionCloseEvent extends Action {
  type: typeof SESSION_CLOSE
  payload: { session: QBWebRTCSession }
}

export interface UserNotAnswerEvent extends Action {
  type: typeof NO_ANSWER
  payload: { session: QBWebRTCSession; userId: number }
}

export interface SessionConnectionStateChangedEvent extends Action {
  type: typeof SESSION_STATE_CHANGED
  payload: { session: QBWebRTCSession; userId: number; state: unknown }
}

export interface CallReconnectEvent extends Action {
  type: typeof CALL_RECONNECT
  payload: {
    session: QBWebRTCSession
    userId: number
    state: unknown
  }
}

export interface GetVideoInputSourcesRequestAction extends Action {
  type: typeof GET_VIDEO_INPUT_SOURCES_REQUEST
}

export interface GetVideoInputSourcesSuccessAction extends Action {
  type: typeof GET_VIDEO_INPUT_SOURCES_SUCCESS
  payload: MediaDeviceInfo[]
}

export interface GetVideoInputSourcesFailureAction extends Action {
  type: typeof GET_VIDEO_INPUT_SOURCES_FAILURE
  error: string
}

export interface SwitchCameraRequestAction extends Action {
  type: typeof SWITCH_CAMERA_REQUEST
  payload: { deviceId: MediaDeviceInfo['deviceId'] }
}

export interface SwitchCameraSuccessAction extends Action {
  type: typeof SWITCH_CAMERA_SUCCESS
}

export interface SwitchCameraFailureAction extends Action {
  type: typeof SWITCH_CAMERA_FAILURE
  error: string
}

export interface UpdateCallDurationAction extends Action {
  type: typeof UPDATE_CALL_DURATION
  payload: string
}

export type QBWebRTCAction =
  | QBAcceptCallRequestAction
  | QBAcceptCallSuccessAction
  | QBAcceptCallFailureAction
  | QBStopCallRequestAction
  | QBStopCallSuccessAction
  | QBStopCallFailureAction
  | QBRejectCallRequestAction
  | QBRejectCallSuccessAction
  | QBRejectCallFailureAction
  | ToggleMuteAudioRequestAction
  | ToggleMuteAudioSuccessAction
  | ToggleMuteAudioFailureAction
  | ToggleMuteVideoRequestAction
  | ToggleMuteVideoSuccessAction
  | ToggleMuteVideoFailureAction
  | ToggleScreenSharingRequestAction
  | ToggleScreenSharingSuccessAction
  | ToggleScreenSharingFailureAction
  | CallRequestEvent
  | CallAcceptedEvent
  | CallRejectedEvent
  | CallStoppedEvent
  | CallStatsEvent
  | RemoteStreamEvent
  | SessionCloseEvent
  | UserNotAnswerEvent
  | SessionConnectionStateChangedEvent
  | CallReconnectEvent
  | GetVideoInputSourcesRequestAction
  | GetVideoInputSourcesSuccessAction
  | GetVideoInputSourcesFailureAction
  | SwitchCameraRequestAction
  | SwitchCameraSuccessAction
  | SwitchCameraFailureAction
  | UpdateCallDurationAction
