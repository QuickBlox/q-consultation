import { Action } from 'redux'

export const RECORD_START_REQUEST = 'RECORD_START_REQUEST'
export const RECORD_START_SUCCESS = 'RECORD_START_SUCCESS'
export const RECORD_START_FAILURE = 'RECORD_START_FAILURE'
export const RECORD_STOP_REQUEST = 'RECORD_STOP_REQUEST'
export const RECORD_STOP_SUCCESS = 'RECORD_STOP_SUCCESS'
export const RECORD_STOP_FAILURE = 'RECORD_STOP_FAILURE'
export const GET_RECORDS_REQUEST = 'GET_RECORDS_REQUEST'
export const GET_RECORDS_SUCCESS = 'GET_RECORDS_SUCCESS'
export const GET_RECORDS_FAILURE = 'GET_RECORDS_FAILURE'
export const UPLOAD_RECORD_REQUEST = 'UPLOAD_RECORD_REQUEST'
export const UPLOAD_RECORD_SUCCESS = 'UPLOAD_RECORD_SUCCESS'
export const UPLOAD_RECORD_FAILURE = 'UPLOAD_RECORD_FAILURE'
export const UPLOAD_RECORD_PROGRESS = 'UPLOAD_RECORD_PROGRESS'
export const CREATE_VOICE = 'CREATE_VOICE'
export const RECORD_ERROR = 'RECORD_ERROR'

export interface StartRecordRequestAction extends Action {
  type: typeof RECORD_START_REQUEST
  payload: MediaStream
}

export interface StartRecordSuccessAction extends Action {
  type: typeof RECORD_START_SUCCESS
}

export interface StartRecordFailureAction extends Action {
  type: typeof RECORD_START_FAILURE
  error: string
}

export interface StopRecordRequestAction extends Action {
  type: typeof RECORD_STOP_REQUEST
}

export interface StopRecordSuccessAction extends Action {
  type: typeof RECORD_STOP_SUCCESS
}

export interface StopRecordFailureAction extends Action {
  type: typeof RECORD_STOP_FAILURE
  error: string
}

export interface GetRecordsRequest extends Action {
  type: typeof GET_RECORDS_REQUEST
  payload: QBAppointment['_id']
}

export interface GetRecordsSuccess extends Action {
  type: typeof GET_RECORDS_SUCCESS
  payload: {
    appointmentId: QBAppointment['_id']
    entries: Dictionary<QBRecord>
    list: Array<QBRecord['_id']>
  }
}

export interface GetRecordsFailure extends Action {
  type: typeof GET_RECORDS_FAILURE
  error: string
}

export interface UploadRecordRequest extends Action {
  type: typeof UPLOAD_RECORD_REQUEST
  payload: {
    blob: Blob
    appointmentId: QBAppointment['_id']
  }
}

export interface UploadRecordSuccess extends Action {
  type: typeof UPLOAD_RECORD_SUCCESS
  payload?: QBRecord
}

export interface UploadRecordFailure extends Action {
  type: typeof UPLOAD_RECORD_FAILURE
  error: string
}

export interface UploadRecordProgress extends Action {
  type: typeof UPLOAD_RECORD_PROGRESS
  payload: number
}

export interface CreateVoice extends Action {
  type: typeof CREATE_VOICE
  payload: {
    blob: Blob
    appointmentId: QBAppointment['_id']
  }
}

export interface RecordError extends Action {
  type: typeof RECORD_ERROR
  error: string
}

export type RecorderAction =
  | StartRecordRequestAction
  | StartRecordSuccessAction
  | StartRecordFailureAction
  | StopRecordRequestAction
  | StopRecordSuccessAction
  | StopRecordFailureAction
  | GetRecordsRequest
  | GetRecordsSuccess
  | GetRecordsFailure
  | UploadRecordRequest
  | UploadRecordSuccess
  | UploadRecordFailure
  | UploadRecordProgress
  | CreateVoice
  | RecordError
