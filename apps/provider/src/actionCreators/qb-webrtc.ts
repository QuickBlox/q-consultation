import { QBAppointment, QBWebRTCSession } from '@qc/quickblox'
import * as Types from '../actions'
import { UserInfo } from '../actions'

export function startCall({
  callType,
  appointmentId,
  opponentsIds,
}: {
  callType: 1 | 2
  appointmentId: QBAppointment['_id']
  opponentsIds: number[]
}): Types.QBStartCallRequestAction {
  return {
    type: Types.QB_START_CALL_REQUEST,
    payload: { callType, appointmentId, opponentsIds },
  }
}

export function startCallSuccess(payload: {
  session: QBWebRTCSession
  appointmentId: QBAppointment['_id']
}): Types.QBStartCallSuccessAction {
  return {
    type: Types.QB_START_CALL_SUCCESS,
    payload,
  }
}

export function startCallFailure(
  error: string,
): Types.QBStartCallFailureAction {
  return { type: Types.QB_START_CALL_FAILURE, error }
}

export function acceptCall(payload: {
  start: number
  session: QBWebRTCSession
  appointmentId: QBAppointment['_id']
}): Types.QBAcceptCallRequestAction {
  return {
    type: Types.QB_ACCEPT_CALL_REQUEST,
    payload,
  }
}

export function acceptCallSuccess(payload: {
  session: QBWebRTCSession
  appointmentId: QBAppointment['_id']
}): Types.QBAcceptCallSuccessAction {
  return { type: Types.QB_ACCEPT_CALL_SUCCESS, payload }
}

export function acceptCallFailure(
  error: string,
): Types.QBAcceptCallFailureAction {
  return { type: Types.QB_ACCEPT_CALL_FAILURE, error }
}

export function stopCall(
  then?: (data?: Types.QBStopCallSuccessAction) => void,
): Types.QBStopCallRequestAction {
  return { type: Types.QB_STOP_CALL_REQUEST, payload: { then } }
}

export function stopCallSuccess(): Types.QBStopCallSuccessAction {
  return { type: Types.QB_STOP_CALL_SUCCESS }
}

export function stopCallFailure(error: string): Types.QBStopCallFailureAction {
  return { type: Types.QB_STOP_CALL_FAILURE, error }
}

export function rejectCall(payload: {
  session: QBWebRTCSession
  reason: string
}): Types.QBRejectCallRequestAction {
  return { type: Types.QB_REJECT_CALL_REQUEST, payload }
}

export function rejectCallSuccess(): Types.QBRejectCallSuccessAction {
  return { type: Types.QB_REJECT_CALL_SUCCESS }
}

export function rejectCallFailure(
  error: string,
): Types.QBRejectCallFailureAction {
  return { type: Types.QB_REJECT_CALL_FAILURE, error }
}

export function callRequestEvent(payload: {
  session: QBWebRTCSession
  userInfo: UserInfo
}): Types.CallRequestEvent {
  return { type: Types.CALL, payload }
}

export function callAcceptedEvent(payload: {
  session: QBWebRTCSession
  userId: number
  userInfo: UserInfo
}): Types.CallAcceptedEvent {
  return { type: Types.CALL_ACCEPT, payload }
}

export function callRejectedEvent(payload: {
  session: QBWebRTCSession
  userId: number
  userInfo: UserInfo
}): Types.CallRejectedEvent {
  return { type: Types.CALL_REJECT, payload }
}

export function callStoppedEvent(payload: {
  session: QBWebRTCSession
  userId: number
  userInfo: UserInfo
}): Types.CallStoppedEvent {
  return { type: Types.CALL_STOP, payload }
}

export function callStatsEvent(payload: {
  session: QBWebRTCSession
  userId: number
  stats: string[]
}): Types.CallStatsEvent {
  return { type: Types.CALL_STATS, payload }
}

export function remoteStreamEvent(payload: {
  session: QBWebRTCSession
  userId: number
  stream: MediaStream
}): Types.RemoteStreamEvent {
  return { type: Types.REMOTE_STREAM, payload }
}

export function sessionCloseEvent(payload: {
  session: QBWebRTCSession
}): Types.SessionCloseEvent {
  return { type: Types.SESSION_CLOSE, payload }
}

export function userNotAnswerEvent(payload: {
  session: QBWebRTCSession
  userId: number
}): Types.UserNotAnswerEvent {
  return { type: Types.NO_ANSWER, payload }
}

export function sessionConnectionStateChangedEvent(payload: {
  session: QBWebRTCSession
  userId: number
  state: unknown
}): Types.SessionConnectionStateChangedEvent {
  return { type: Types.SESSION_STATE_CHANGED, payload }
}

export function callReconnectEvent(payload: {
  session: QBWebRTCSession
  userId: number
  state: unknown
}): Types.CallReconnectEvent {
  return { type: Types.CALL_RECONNECT, payload }
}

export function toggleMuteAudio(): Types.ToggleMuteAudioRequestAction {
  return { type: Types.TOGGLE_MUTE_AUDIO_REQUEST }
}

export function toggleMuteAudioSuccess(
  muted: boolean,
): Types.ToggleMuteAudioSuccessAction {
  return {
    type: Types.TOGGLE_MUTE_AUDIO_SUCCESS,
    payload: { muted },
  }
}

export function toggleMuteAudioFailure(
  error: string,
): Types.ToggleMuteAudioFailureAction {
  return { type: Types.TOGGLE_MUTE_AUDIO_FAILURE, error }
}

export function toggleMuteVideo(): Types.ToggleMuteVideoRequestAction {
  return { type: Types.TOGGLE_MUTE_VIDEO_REQUEST }
}

export function toggleMuteVideoSuccess(
  muted: boolean,
): Types.ToggleMuteVideoSuccessAction {
  return {
    type: Types.TOGGLE_MUTE_VIDEO_SUCCESS,
    payload: { muted },
  }
}

export function toggleMuteVideoFailure(
  error: string,
): Types.ToggleMuteVideoFailureAction {
  return { type: Types.TOGGLE_MUTE_VIDEO_FAILURE, error }
}

export function toggleScreenSharing(): Types.ToggleScreenSharingRequestAction {
  return { type: Types.TOGGLE_SCREENSHARE_REQUEST }
}

export function toggleScreenSharingSuccess(): Types.ToggleScreenSharingSuccessAction {
  return { type: Types.TOGGLE_SCREENSHARE_SUCCESS }
}

export function toggleScreenSharingFailure(
  error: string,
): Types.ToggleScreenSharingFailureAction {
  return { type: Types.TOGGLE_SCREENSHARE_FAILURE, error }
}

export function getVideoInputSources(): Types.GetVideoInputSourcesRequestAction {
  return { type: Types.GET_VIDEO_INPUT_SOURCES_REQUEST }
}

export function getVideoInputSourcesSuccess(
  payload: MediaDeviceInfo[],
): Types.GetVideoInputSourcesSuccessAction {
  return { type: Types.GET_VIDEO_INPUT_SOURCES_SUCCESS, payload }
}

export function getVideoInputSourcesFailure(
  error: string,
): Types.GetVideoInputSourcesFailureAction {
  return { type: Types.GET_VIDEO_INPUT_SOURCES_FAILURE, error }
}

export function switchCamera(
  deviceId: string,
): Types.SwitchCameraRequestAction {
  return { type: Types.SWITCH_CAMERA_REQUEST, payload: { deviceId } }
}

export function switchCameraSuccess(): Types.SwitchCameraSuccessAction {
  return { type: Types.SWITCH_CAMERA_SUCCESS }
}

export function switchCameraFailure(
  error: string,
): Types.SwitchCameraFailureAction {
  return { type: Types.SWITCH_CAMERA_FAILURE, error }
}

export function updateCallDuration(
  duration: string,
): Types.UpdateCallDurationAction {
  return { type: Types.UPDATE_CALL_DURATION, payload: duration }
}
