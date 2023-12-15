import { END, eventChannel, EventChannel, SagaIterator, Task } from 'redux-saga'
import {
  call,
  cancel,
  cancelled,
  cps,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'
import QB, { QBGetUserMediaParams, QBWebRTCSession } from '@qc/quickblox'

import * as Types from '../actions'
import {
  acceptCall as acceptCallRequest,
  acceptCallFailure,
  acceptCallSuccess,
  callAcceptedEvent,
  callReconnectEvent,
  callRejectedEvent,
  callRequestEvent,
  callStatsEvent,
  callStoppedEvent,
  getVideoInputSources,
  getVideoInputSourcesFailure,
  getVideoInputSourcesSuccess,
  rejectCall as rejectCallRequest,
  rejectCallFailure,
  rejectCallSuccess,
  remoteStreamEvent,
  sessionCloseEvent,
  sessionConnectionStateChangedEvent,
  showNotification,
  startCallFailure,
  startCallSuccess,
  stopCallFailure,
  stopCallSuccess,
  switchCamera as switchCameraRequest,
  switchCameraFailure,
  switchCameraSuccess,
  toggleMuteAudioFailure,
  toggleMuteAudioSuccess,
  toggleMuteVideoFailure,
  toggleMuteVideoSuccess,
  toggleScreenSharing as toggleScreenSharingRequest,
  toggleScreenSharingFailure,
  toggleScreenSharingSuccess,
  updateCallDuration as updateCallDurationRequest,
  userNotAnswerEvent,
} from '../actionCreators'
import {
  authMyAccountIdSelector,
  callMuteAudioSelector,
  callMuteVideoSelector,
  callScreenshareSelector,
  callSessionSelector,
} from '../selectors'
import { stringifyError } from '../utils/parse'

const defaultQBMediaParams: QBGetUserMediaParams = {
  audio: true,
  elemId: 'local',
  video: true,
}

const createNotification = (errorMessage: string) =>
  showNotification({
    duration: 3 * SECOND,
    id: Date.now().toString(),
    message: `Failed to start call: ${errorMessage}`,
    position: 'bottom-center',
    type: 'error',
  })

function* checkVideoInputSources() {
  try {
    const devices: MediaDeviceInfo[] = yield QB.webrtc.getMediaDevices(
      'videoinput',
    )

    yield put(getVideoInputSourcesSuccess(devices))
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(getVideoInputSourcesFailure(errorMessage))
  }
}

type CallEvents =
  | Types.CallRequestEvent
  | Types.CallAcceptedEvent
  | Types.CallRejectedEvent
  | Types.CallStoppedEvent
  | Types.CallStatsEvent
  | Types.RemoteStreamEvent
  | Types.SessionCloseEvent
  | Types.UserNotAnswerEvent
  | Types.SessionConnectionStateChangedEvent
  | Types.CallReconnectEvent

function createQBWebRTCEventChannel(): EventChannel<CallEvents> {
  return eventChannel((emitter) => {
    QB.webrtc.onCallListener = (session, userInfo) =>
      emitter(callRequestEvent({ session, userInfo }))
    QB.webrtc.onAcceptCallListener = (session, userId, userInfo) =>
      emitter(callAcceptedEvent({ session, userId, userInfo }))
    QB.webrtc.onRejectCallListener = (session, userId, userInfo) =>
      emitter(callRejectedEvent({ session, userId, userInfo }))
    QB.webrtc.onStopCallListener = (session, userId, userInfo) =>
      emitter(callStoppedEvent({ session, userId, userInfo }))
    QB.webrtc.onCallStatsReport = (session, userId, stats) =>
      emitter(callStatsEvent({ session, userId, stats }))
    QB.webrtc.onRemoteStreamListener = (session, userId, stream) =>
      emitter(remoteStreamEvent({ session, userId, stream }))
    QB.webrtc.onSessionCloseListener = (session) =>
      emitter(sessionCloseEvent({ session }))
    QB.webrtc.onUserNotAnswerListener = (session, userId) =>
      emitter(userNotAnswerEvent({ session, userId }))
    QB.webrtc.onSessionConnectionStateChangedListener = (
      session,
      userId,
      state,
    ) => emitter(sessionConnectionStateChangedEvent({ session, userId, state }))
    // @ts-ignore
    QB.webrtc.onReconnectListener = (session, userId, state) =>
      emitter(callReconnectEvent({ session, userId, state }))

    return () => undefined
  })
}
function createCallDurationChannel(startTime: number) {
  let interval: number | undefined

  return eventChannel<string>((emitter) => {
    interval = window.setInterval(() => {
      let diff = Date.now() - startTime
      const result = []

      if (diff >= HOUR) {
        const hours = Math.floor(diff / HOUR)

        result.push(hours < 10 ? `0${hours}` : hours)
        diff -= HOUR * hours
      }

      if (diff >= MINUTE) {
        const minutes = Math.floor(diff / MINUTE)

        result.push(minutes < 10 ? `0${minutes}` : minutes)
        diff -= MINUTE * minutes
      } else {
        result.push('00')
      }
      const seconds = Math.floor(diff / SECOND)

      result.push(seconds < 10 ? `0${seconds}` : seconds)
      emitter(result.join(':'))
    }, SECOND)

    return () => window.clearInterval(interval)
  })
}

function* handleRejectCall() {
  yield put(
    showNotification({
      id: Date.now().toString(),
      translate: true,
      message: 'USER_IS_BUSY',
      position: 'bottom-center',
    }),
  )
}

function* callDurationUpdater(start: number): SagaIterator<void> {
  const channel: EventChannel<string> = yield call(
    createCallDurationChannel,
    start,
  )

  try {
    while (true) {
      const duration: string = yield take(channel)

      yield put(updateCallDurationRequest(duration))
    }
  } finally {
    if (yield cancelled()) {
      channel.close()
    }
  }
}

function* updateCallDuration(start: number) {
  const task: Task = yield fork(callDurationUpdater, start)

  yield take([
    Types.LOGOUT_SUCCESS,
    Types.SESSION_CLOSE,
    Types.CALL_REJECT,
    Types.QB_STOP_CALL_SUCCESS,
    Types.QB_STOP_CALL_FAILURE,
  ])
  yield cancel(task)
}

function isCallEvent(event: Types.Action): event is Types.CallRequestEvent {
  return event && event.type && event.type === Types.CALL
}

function isRemoteStreamEvent(
  event: Types.Action,
): event is Types.RemoteStreamEvent {
  return event && event.type && event.type === Types.REMOTE_STREAM
}

export function* handleQBWebRTCEvents() {
  const channel: EventChannel<CallEvents> = yield call(
    createQBWebRTCEventChannel,
  )

  while (true) {
    try {
      const event: CallEvents = yield take(channel)

      yield put(event)

      if (isCallEvent(event)) {
        const session: ReturnType<typeof callSessionSelector> = yield select(
          callSessionSelector,
        )
        const userId: ReturnType<typeof authMyAccountIdSelector> = yield select(
          authMyAccountIdSelector,
        )

        if (event.payload.session.initiatorID === userId) {
          // ignore call signal from myself
          return
        }
        let rejectReason = ''

        if (session) {
          rejectReason = 'User is busy at the moment'
        }

        if (rejectReason) {
          yield put(
            rejectCallRequest({
              reason: rejectReason,
              session: event.payload.session,
            }),
          )
        } else {
          const { userInfo } = event.payload

          if (userInfo && userInfo.start) {
            yield put(
              acceptCallRequest({
                session: event.payload.session,
                start: userInfo.start,
                appointmentId: userInfo.appointmentId,
              }),
            )
            const { success } = yield race({
              success: take(Types.QB_ACCEPT_CALL_SUCCESS),
              fail: take(Types.QB_ACCEPT_CALL_FAILURE),
            })

            if (success) {
              yield fork(updateCallDuration, Number(userInfo.start))
            }
          }
        }
      }

      if (isRemoteStreamEvent(event)) {
        const { session, stream, userId } = event.payload

        session.attachMediaStream(`remote-${userId}`, stream)
      }
    } catch (e) {
      const errorMessage = stringifyError(e)

      yield put({ type: 'QB_WEBRTC_CHANNEL_ERROR', error: errorMessage })
    }
  }
}

function* startCall(action: Types.QBStartCallRequestAction) {
  try {
    const { callType, appointmentId, opponentsIds } = action.payload
    const session: QBWebRTCSession = QB.webrtc.createNewSession(
      opponentsIds,
      callType,
    )

    yield cps([session, session.getUserMedia], defaultQBMediaParams)
    yield call([session, session.call], { start: Date.now(), appointmentId })
    yield put(startCallSuccess({ session, appointmentId }))
    yield fork(
      updateCallDuration,
      session.startCallTime ? session.startCallTime.getTime() : Date.now(),
    )
    yield delay(500)
    yield put(getVideoInputSources())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(startCallFailure(errorMessage))
    yield put(createNotification(errorMessage))
  }
}

function* acceptCall(action: Types.QBAcceptCallRequestAction) {
  try {
    const { session, start, appointmentId } = action.payload
    const end =
      Number(start) + QB.service.qbInst.config.webrtc.answerTimeInterval * 1000

    yield cps([session, session.getUserMedia], defaultQBMediaParams)

    if (session.state < 3 && Date.now() < end) {
      yield call([session, session.accept], {})
      yield put(acceptCallSuccess({ session, appointmentId }))
      yield put(getVideoInputSources())
    } else {
      session.stop({})
      throw new Error("Can't accept call - the session is already closed")
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(acceptCallFailure(errorMessage))
    yield put(createNotification(errorMessage))
  }
}

function* stopCall(action: Types.QBStopCallRequestAction) {
  try {
    const { then } = action.payload
    const session: ReturnType<typeof callSessionSelector> = yield select(
      callSessionSelector,
    )

    if (session) {
      session.stop({})
    }
    const result = stopCallSuccess()

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(stopCallFailure(errorMessage))
    yield put(createNotification(errorMessage))
  }
}

function* rejectCall(action: Types.QBRejectCallRequestAction) {
  try {
    const { reason, session } = action.payload

    session.reject({ reason })
    yield put(rejectCallSuccess())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(rejectCallFailure(errorMessage))
    yield put(createNotification(errorMessage))
  }
}

function* toggleMuteAudio() {
  try {
    const session: ReturnType<typeof callSessionSelector> = yield select(
      callSessionSelector,
    )

    if (session) {
      const muted: ReturnType<typeof callMuteAudioSelector> = yield select(
        callMuteAudioSelector,
      )

      if (muted) {
        session.unmute('audio')
      } else {
        session.mute('audio')
      }
      yield put(toggleMuteAudioSuccess(!muted))
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(toggleMuteAudioFailure(errorMessage))
  }
}

function* toggleMuteVideo() {
  try {
    const session: ReturnType<typeof callSessionSelector> = yield select(
      callSessionSelector,
    )

    if (session) {
      const muted: ReturnType<typeof callMuteVideoSelector> = yield select(
        callMuteVideoSelector,
      )

      if (muted) {
        session.unmute('video')
      } else {
        session.mute('video')
      }
      yield put(toggleMuteVideoSuccess(!muted))
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(toggleMuteVideoFailure(errorMessage))
  }
}

function* switchCamera(action: Types.SwitchCameraRequestAction) {
  const { deviceId } = action.payload

  try {
    const session: ReturnType<typeof callSessionSelector> = yield select(
      callSessionSelector,
    )
    const muted: ReturnType<typeof callMuteAudioSelector> = yield select(
      callMuteAudioSelector,
    )

    if (session) {
      if (
        session.mediaParams &&
        typeof session.mediaParams.video !== 'object'
      ) {
        session.mediaParams.video = {}
      }
      yield cps([session, session.switchMediaTracks], {
        video: { exact: deviceId },
      })

      if (muted) {
        session.mute('audio')
      }
    }
    yield put(switchCameraSuccess())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(switchCameraFailure(errorMessage))
    yield delay(500)
    yield put(switchCameraRequest(deviceId))
  }
}

function* watchSharingTrachEnded(track: MediaStreamTrack) {
  const channel = eventChannel((emitter) => {
    // eslint-disable-next-line no-param-reassign
    track.onended = () => {
      emitter('ended')
      emitter(END)
    }

    return () => undefined
  })

  while (true) {
    yield take(channel)
    yield put(toggleScreenSharingRequest())
  }
}

function* toggleScreenSharing() {
  try {
    const session: ReturnType<typeof callSessionSelector> = yield select(
      callSessionSelector,
    )
    const sharing: ReturnType<typeof callScreenshareSelector> = yield select(
      callScreenshareSelector,
    )
    const videoMuted: ReturnType<typeof callMuteVideoSelector> = yield select(
      callMuteVideoSelector,
    )

    if (session?.localStream) {
      const method: (
        constraints?: MediaStreamConstraints | undefined,
      ) => Promise<MediaStream> = sharing
        ? navigator.mediaDevices.getUserMedia
        : navigator.mediaDevices.getDisplayMedia
      const newStream: MediaStream = yield call(
        { context: navigator.mediaDevices, fn: method },
        {
          video:
            sharing && session.mediaParams?.video
              ? session.mediaParams.video
              : true,
        },
      )
      const newVideoTrack = newStream.getVideoTracks()[0]

      if (!sharing) {
        yield fork(watchSharingTrachEnded, newVideoTrack)
      }
      session.localStream?.getVideoTracks().forEach((track) => track.stop())
      const clone = session.localStream.clone()

      clone.getVideoTracks().forEach((track) => clone.removeTrack(track))
      clone.addTrack(newVideoTrack)
      session._replaceTracks(clone)
      session.localStream = clone

      if (sharing && videoMuted) {
        session.mute('video')
      }
      yield put(toggleScreenSharingSuccess())
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(toggleScreenSharingFailure(errorMessage))
  }
}

function* webrtcModuleEventsFlow() {
  while (true) {
    yield take(Types.QB_LOGIN_SUCCESS)

    const task: Task = yield fork(handleQBWebRTCEvents)

    yield take(Types.LOGOUT_SUCCESS)
    yield cancel(task)
  }
}

export default [
  takeEvery(Types.QB_START_CALL_REQUEST, startCall),
  takeEvery(Types.QB_ACCEPT_CALL_REQUEST, acceptCall),
  takeEvery(Types.QB_STOP_CALL_REQUEST, stopCall),
  takeEvery(Types.QB_REJECT_CALL_REQUEST, rejectCall),
  takeEvery(Types.CALL_REJECT, handleRejectCall),
  takeEvery(Types.TOGGLE_MUTE_AUDIO_REQUEST, toggleMuteAudio),
  takeEvery(Types.TOGGLE_MUTE_VIDEO_REQUEST, toggleMuteVideo),
  takeEvery(Types.TOGGLE_SCREENSHARE_REQUEST, toggleScreenSharing),
  takeEvery(Types.SWITCH_CAMERA_REQUEST, switchCamera),
  takeEvery(Types.GET_VIDEO_INPUT_SOURCES_REQUEST, checkVideoInputSources),
  webrtcModuleEventsFlow(),
]
