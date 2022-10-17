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

export function getRecords(
  fileIds: Array<QBContentObject['id']>,
): Types.GetRecordsRequest {
  return { type: Types.GET_RECORDS_REQUEST, payload: fileIds }
}

export function getRecordsSuccess(dataFiles: {
  [key: string]: QBContentObject
}): Types.GetRecordsSuccess {
  return { type: Types.GET_RECORDS_SUCCESS, payload: dataFiles }
}

export function getRecordsFailure(error: string): Types.GetRecordsFailure {
  return { type: Types.GET_RECORDS_FAILURE, error }
}

export function uploadRecord(payload: {
  blob: Blob
  appointmentId?: QBAppointment['_id']
}): Types.UploadRecordRequest {
  return { type: Types.UPLOAD_RECORD_REQUEST, payload }
}

export function uploadRecordSuccess(): Types.UploadRecordSuccess {
  return { type: Types.UPLOAD_RECORD_SUCCESS }
}

export function uploadRecordFailure(error: string): Types.UploadRecordFailure {
  return { type: Types.UPLOAD_RECORD_FAILURE, error }
}

export function recordError(error: string): Types.RecordError {
  return { type: Types.RECORD_ERROR, error }
}
