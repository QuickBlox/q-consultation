import { END, EventChannel, eventChannel } from 'redux-saga'
import {
  all,
  call,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import { QBDataGet } from '../qb-api-calls'
import * as Types from '../actions'
import {
  getRecordsFailure,
  getRecordsSuccess,
  startRecordFailure,
  startRecordSuccess,
  stopRecordFailure,
  stopRecordSuccess,
  showNotification,
  uploadRecord as uploadRecordRequest,
  recordError,
  uploadRecordFailure,
  uploadRecordSuccess,
  uploadRecordProgress,
  toggleShowModal,
  createVoice,
} from '../actionCreators'
import {
  authSessionSelector,
  callAppointmentIdSelector,
  createAppointmentByIdSelector,
} from '../selectors'
import { stringifyError } from '../utils/parse'
import { normalize } from '../utils/normalize'
import { Action, AnyAction } from 'redux'
import { takeEveryAll } from '../utils/saga'
import { ajax } from './ajax'

const mediaRecorders = {
  video: new QBMediaRecorder({
    mimeType: 'video/webm;codecs=vp8',
  }),
  audio: AI_RECORD_ANALYTICS
    ? new QBMediaRecorder({
        mimeType: 'audio/webm',
      })
    : undefined,
}

type MediaRecorders = typeof mediaRecorders

interface RecordResponse {
  class_name: string
  items: QBRecord[]
  limit: number
  skip: number
}

function* getRecords(action: Types.GetRecordsRequest) {
  try {
    const { items }: RecordResponse = yield call(
      QBDataGet,
      'Record',
      {
        appointment_id: action.payload,
        sort_asc: 'created_at'
      },
    )
    const { entries, list } = normalize(items, '_id')

    yield put(getRecordsSuccess({ appointmentId: action.payload, entries, list }))
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(getRecordsFailure(errorMessage))
  }
}

function createQBRecorderEventChannel<T extends Action>(
  recorder: QBMediaRecorder,
  onStop?: (blob: Blob) => T,
) {
  return eventChannel<Types.RecordError | T>((emitter) => {
    // eslint-disable-next-line no-param-reassign
    recorder.callbacks.onerror = (e) => {
      const errorMessage = stringifyError(e)

      emitter(recordError(errorMessage))
    }

    if (onStop) {
      // eslint-disable-next-line no-param-reassign
      recorder.callbacks.onstop = (blob) => {
        emitter(onStop(blob))
      }
    }

    return () => undefined
  })
}

function* handleQBMediaRecorderEvents<T extends Action>(
  recorder: QBMediaRecorder,
  onStop?: (blob: Blob) => T,
) {
  try {
    const channel: EventChannel<Types.RecordError | T> = yield call(
      createQBRecorderEventChannel,
      recorder,
      onStop,
    )
    const event: Types.RecordError | T = yield take(channel)

    yield put(event)
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(recordError(errorMessage))
  }
}

function* startRecording(recorders: MediaRecorders, stream: MediaStream) {
  try {
    recorders.video.start(stream)

    if (recorders.audio) {
      const audioStream = new MediaStream()

      stream.getAudioTracks().forEach((track) => {
        audioStream.addTrack(track)
      })

      recorders.audio.start(audioStream)
    }
    yield put(startRecordSuccess())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(startRecordFailure(errorMessage))
  }
}

function* stopRecording(recorders: MediaRecorders) {
  try {
    const videoState = recorders.video.getState()

    if (videoState === 'paused' || videoState === 'recording') {
      recorders.video.stop()
    }

    if (recorders.audio) {
      const audioState = recorders.audio.getState()

      if (audioState === 'paused' || audioState === 'recording') {
        recorders.audio.stop()
      }
    }

    yield put(stopRecordSuccess())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(stopRecordFailure(errorMessage))
  }
}

function* recordStart(action: Types.StartRecordRequestAction) {
  const stream = action.payload
  const appointmentId: ReturnType<typeof callAppointmentIdSelector> =
    yield select(callAppointmentIdSelector)

  if (QBMediaRecorder.isAvailable() && appointmentId) {
    yield all([
      fork(handleQBMediaRecorderEvents, mediaRecorders.video, (blob) =>
        uploadRecordRequest({ appointmentId, blob })
      ),
      mediaRecorders.audio &&
        fork(handleQBMediaRecorderEvents, mediaRecorders.audio, (blob) =>
          createVoice({ appointmentId, blob })
        ),
    ])

    yield call(startRecording, mediaRecorders, stream)

    const { stop } = yield race({
      stop: take([
        Types.LOGOUT_SUCCESS,
        Types.SESSION_CLOSE,
        Types.RECORD_STOP_REQUEST,
        Types.QB_STOP_CALL_REQUEST,
        Types.CALL_STOP,
      ]),
      error: take(Types.RECORD_ERROR),
    })

    if (stop) {
      yield call(stopRecording, mediaRecorders)
    }
  } else {
    yield put(startRecordFailure('Record is not available'))
  }
}

function createUploadChannel(
  token: string,
  appointmentId: QBAppointment['_id'],
  videoFile: File | null,
  voiceFile: File | null,
) {
  const url = `${SERVER_APP_URL}/appointments/${appointmentId}/records`
  const body = new FormData()

  if (videoFile) {
    body.append('video', videoFile, videoFile.name)
  }
  if (voiceFile) {
    body.append('audio', voiceFile, voiceFile.name)
  }

  return eventChannel((emitter) => {
    ajax<QBRecord>({
      method: 'POST',
      url,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      onProgress: (event) => {
        emitter(uploadRecordProgress(event.loaded / event.total))
      },
      body,
      responseType: 'json',
    })
      .then((response) => {
        if (response.status < 200 || response.status > 299) {
          return emitter(
            uploadRecordFailure(typeof response === 'string' ? response : ''),
          )
        }

        return emitter(uploadRecordSuccess(response.response))
      })
      .catch(() => emitter(END))

    return () => null
  })
}

function* uploadRecord(
  actions:
    | [Types.UploadRecordRequest, Types.CreateVoice]
    | [Types.UploadRecordRequest],
) {
  try {
    const [uploadRecordAction, createVoiceAction] = actions
    const { appointmentId, blob: videoRecord } = uploadRecordAction.payload
    const { blob: voiceRecord } = createVoiceAction?.payload || {}

    yield put(
      showNotification({
        id: Date.now().toString(),
        translate: true,
        message: 'UploadNotClose',
        position: 'bottom-center',
      }),
    )
    const lastModified = new Date()
    const videoFile = new File(
      [videoRecord],
      `${lastModified.toISOString()}.webm`,
      {
        type: 'video/webm',
        lastModified: lastModified.valueOf(),
      },
    )
    const voiceFile = voiceRecord && new File(
      [voiceRecord],
      `${lastModified.toISOString()}.webm`,
      {
        type: 'audio/webm',
        lastModified: lastModified.valueOf(),
      },
    )

    debugger
    if (videoFile.size > FILE_SIZE_LIMIT) {
      yield put(toggleShowModal({ modal: 'SaveRecordModal', file: videoFile }))
    }

    if (!AI_RECORD_ANALYTICS && videoFile.size > FILE_SIZE_LIMIT) {
      yield put(uploadRecordSuccess())
    } else {
      const session: ReturnType<typeof authSessionSelector> = yield select(
        authSessionSelector,
      )
      const channel: EventChannel<AnyAction> = yield call(
        // @ts-ignore
        createUploadChannel,
        session!.token,
        appointmentId,
        videoFile.size > FILE_SIZE_LIMIT ? null : videoFile,
        AI_RECORD_ANALYTICS ? voiceFile : null,
      )

      let result:
        | Types.UploadRecordProgress
        | Types.UploadRecordSuccess
        | Types.UploadRecordFailure

      do {
        result = yield take(channel)

        yield put(result)
      } while (result.type === Types.UPLOAD_RECORD_PROGRESS)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(uploadRecordFailure(errorMessage))
  }
}

export default [
  takeEvery(Types.GET_RECORDS_REQUEST, getRecords),
  takeEvery(Types.RECORD_START_REQUEST, recordStart),
  takeEveryAll(
    AI_RECORD_ANALYTICS
      ? [Types.UPLOAD_RECORD_REQUEST, Types.CREATE_VOICE]
      : [Types.UPLOAD_RECORD_REQUEST],
    uploadRecord,
  ),
]
