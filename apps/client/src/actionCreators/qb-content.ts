import { QBContentObject } from '@qc/quickblox'
import * as Types from '../actions'

export function uploadFile(
  file: File,
  then?: (data: Types.QBContentUploadSuccessAction) => void,
): Types.QBContentUploadRequestAction {
  return {
    type: Types.QB_FILE_UPLOAD_REQUEST,
    payload: { file, then },
  }
}

export function uploadFileProgress(
  payload: number,
): Types.QBContentUploadProgressAction {
  return { type: Types.QB_FILE_UPLOAD_PROGRESS, payload }
}

export function uploadFileSuccess(
  payload: QBContentObject,
): Types.QBContentUploadSuccessAction {
  return { type: Types.QB_FILE_UPLOAD_SUCCESS, payload }
}

export function uploadFileFailure(
  error: string,
): Types.QBContentUploadFailureAction {
  return { type: Types.QB_FILE_UPLOAD_FAILURE, error }
}

export function uploadFileCancel(): Types.QBContentUploadCancelAction {
  return { type: Types.QB_FILE_UPLOAD_CANCEL }
}
