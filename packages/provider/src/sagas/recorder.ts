import { eventChannel } from 'redux-saga'
import {
  all,
  call,
  fork,
  put,
  race,
  SagaReturnType,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import { QBGetInfoFile } from '../qb-api-calls'
import * as Types from '../actions'
import {
  getRecordsFailure,
  getRecordsSuccess,
  startRecordFailure,
  startRecordSuccess,
  stopRecordFailure,
  stopRecordSuccess,
  updateAppointment,
  showNotification,
  uploadFile,
  uploadRecord as uploadRecordRequest,
  recordError,
  uploadRecordFailure,
  uploadRecordSuccess,
} from '../actionCreators'
import {
  callAppointmentIdSelector,
  createAppointmentByIdSelector,
} from '../selectors'
import { stringifyError } from '../utils/parse'

function* getRecords(action: Types.GetRecordsRequest) {
  try {
    const records: Array<{ blob: QBContentObject }> = yield all(
      action.payload.map((id) => call(QBGetInfoFile, id)),
    )
    const recordsDictionary = records.reduce<{
      [key: string]: QBContentObject
    }>((acc, { blob }) => ({ ...acc, [`${blob.id}`]: blob }), {})

    yield put(getRecordsSuccess(recordsDictionary))
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(getRecordsFailure(errorMessage))
  }
}

function* uploadRecord(action: Types.UploadRecordRequest) {
  try {
    const { appointmentId, blob } = action.payload
    const selector = createAppointmentByIdSelector(appointmentId)
    const selectedAppointment: ReturnType<typeof selector> = yield select(
      selector,
    )

    if (selectedAppointment) {
      yield put(
        showNotification({
          id: Date.now().toString(),
          translate: true,
          message: 'UploadNotClose',
          position: 'bottom-center',
        }),
      )
      const lastModified = new Date()
      const name = `${lastModified.toISOString()}.webm`
      const file = new File([blob], name, {
        type: 'video/webm',
        lastModified: lastModified.valueOf(),
      })

      yield put(uploadFile(file, 'record'))
      const { success } = yield race({
        success: take(Types.QB_FILE_UPLOAD_SUCCESS),
        failure: take(Types.QB_FILE_UPLOAD_FAILURE),
      })

      if (success) {
        const { payload }: Types.QBContentUploadSuccessAction = success

        const records = selectedAppointment.records
          ? [...selectedAppointment.records, payload.id]
          : [payload.id]
        const actionAppointment = updateAppointment({
          _id: selectedAppointment._id,
          data: { records },
        })

        yield put(actionAppointment)
      }
    }
    yield put(uploadRecordSuccess())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(uploadRecordFailure(errorMessage))
  }
}

function createQBRecorderEventChannel(
  recorder: QBMediaRecorder,
  appointmentId?: QBAppointment['_id'],
) {
  return eventChannel<Types.RecordError | Types.UploadRecordRequest>(
    (emitter) => {
      // eslint-disable-next-line no-param-reassign
      recorder.callbacks.onerror = (e) => {
        const errorMessage = stringifyError(e)

        emitter(recordError(errorMessage))
      }
      // eslint-disable-next-line no-param-reassign
      recorder.callbacks.onstop = (blob) => {
        emitter(uploadRecordRequest({ appointmentId, blob }))
      }

      return () => undefined
    },
  )
}

function* handleQBMediaRecorderEvents(recorder: QBMediaRecorder) {
  try {
    const appointmentId: ReturnType<typeof callAppointmentIdSelector> =
      yield select(callAppointmentIdSelector)
    const channel: SagaReturnType<typeof createQBRecorderEventChannel> =
      yield call(createQBRecorderEventChannel, recorder, appointmentId)
    const event: Types.RecordError | Types.UploadRecordRequest = yield take(
      channel,
    )

    yield put(event)
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(recordError(errorMessage))
  }
}

function* startRecording(recorder: QBMediaRecorder, stream: MediaStream) {
  try {
    recorder.start(stream)
    yield put(startRecordSuccess())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(startRecordFailure(errorMessage))
  }
}

function* stopRecording(recorder: QBMediaRecorder) {
  try {
    const state = recorder.getState()

    if (state === 'paused' || state === 'recording') {
      recorder.stop()
    }
    yield put(stopRecordSuccess())
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(stopRecordFailure(errorMessage))
  }
}

function* mediaRecorderEventsFlow() {
  while (true) {
    const { payload }: Types.StartRecordRequestAction = yield take(
      Types.RECORD_START_REQUEST,
    )

    if (QBMediaRecorder.isAvailable()) {
      const recorder = new QBMediaRecorder({
        mimeType: 'video/webm;codecs="vp8,opus"',
      })

      yield fork(handleQBMediaRecorderEvents, recorder)
      yield call(startRecording, recorder, payload)

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
        yield call(stopRecording, recorder)
      }
    } else {
      yield put(startRecordFailure('Record is not available'))
    }
  }
}

export default [
  takeEvery(Types.GET_RECORDS_REQUEST, getRecords),
  takeEvery(Types.UPLOAD_RECORD_REQUEST, uploadRecord),
  mediaRecorderEventsFlow(),
]
