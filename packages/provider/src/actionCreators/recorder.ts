import * as Types from '../actions'

export function startRecord(
  payload: MediaStream,
): Types.StartRecordRequestAction {
  return { type: Types.RECORD_START_REQUEST, payload }
}

export function startRecordSuccess(): Types.StartRecordSuccessAction {
  return { type: Types.RECORD_START_SUCCESS }
}

export function startRecordFailure(
  error: string,
): Types.StartRecordFailureAction {
  return { type: Types.RECORD_START_FAILURE, error }
}

export function stopRecord(): Types.StopRecordRequestAction {
  return { type: Types.RECORD_STOP_REQUEST }
}

export function stopRecordSuccess(): Types.StopRecordSuccessAction {
  return { type: Types.RECORD_STOP_SUCCESS }
}

export function stopRecordFailure(
  error: string,
): Types.StopRecordFailureAction {
  return { type: Types.RECORD_STOP_FAILURE, error }
}

export function getRecords(appointmentId:  QBAppointment['_id']): Types.GetRecordsRequest {
  return { type: Types.GET_RECORDS_REQUEST, payload: appointmentId }
}

export function getRecordsSuccess(payload: Types.GetRecordsSuccess['payload']): Types.GetRecordsSuccess {
  return { type: Types.GET_RECORDS_SUCCESS, payload }
}

export function getRecordsFailure(error: string): Types.GetRecordsFailure {
  return { type: Types.GET_RECORDS_FAILURE, error }
}

export function uploadRecord(payload: {
  blob: Blob
  appointmentId: QBAppointment['_id']
}): Types.UploadRecordRequest {
  return { type: Types.UPLOAD_RECORD_REQUEST, payload }
}

export function createVoice(payload: {
  blob: Blob
  appointmentId: QBAppointment['_id']
}): Types.CreateVoice {
  return { type: Types.CREATE_VOICE, payload }
}

export function uploadRecordSuccess(payload?: QBRecord): Types.UploadRecordSuccess {
  return { type: Types.UPLOAD_RECORD_SUCCESS, payload }
}

export function uploadRecordFailure(error: string): Types.UploadRecordFailure {
  return { type: Types.UPLOAD_RECORD_FAILURE, error }
}

export function uploadRecordProgress(payload: number): Types.UploadRecordProgress {
  return { type: Types.UPLOAD_RECORD_PROGRESS, payload }
}

export function recordError(error: string): Types.RecordError {
  return { type: Types.RECORD_ERROR, error }
}
