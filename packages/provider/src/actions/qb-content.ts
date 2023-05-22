import { Action } from 'redux'

export const QB_FILE_UPLOAD_REQUEST = 'QB_FILE_UPLOAD_REQUEST'
export const QB_FILE_UPLOAD_PROGRESS = 'QB_FILE_UPLOAD_PROGRESS'
export const QB_FILE_UPLOAD_SUCCESS = 'QB_FILE_UPLOAD_SUCCESS'
export const QB_FILE_UPLOAD_FAILURE = 'QB_FILE_UPLOAD_FAILURE'
export const QB_FILE_UPLOAD_CANCEL = 'QB_FILE_UPLOAD_CANCEL'

export interface QBContentUploadSuccessAction extends Action {
  type: typeof QB_FILE_UPLOAD_SUCCESS
  payload: QBContentObject
}

export interface QBContentUploadRequestAction extends Action {
  type: typeof QB_FILE_UPLOAD_REQUEST
  payload: {
    file: File
    then?: (data: QBContentUploadSuccessAction) => void
  }
}

export interface QBContentUploadProgressAction extends Action {
  type: typeof QB_FILE_UPLOAD_PROGRESS
  payload: number
}

export interface QBContentUploadFailureAction extends Action {
  type: typeof QB_FILE_UPLOAD_FAILURE
  error: string
}

export interface QBContentUploadCancelAction extends Action {
  type: typeof QB_FILE_UPLOAD_CANCEL
}

export type QBContentAction =
  | QBContentUploadRequestAction
  | QBContentUploadProgressAction
  | QBContentUploadSuccessAction
  | QBContentUploadFailureAction
  | QBContentUploadCancelAction
