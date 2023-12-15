import { eventChannel, END, EventChannel } from 'redux-saga'
import {
  call,
  put,
  race,
  SagaReturnType,
  select,
  take,
} from 'redux-saga/effects'
import QB, { QBContentObject } from '@qc/quickblox'

import { AnyAction } from 'redux'
import * as Types from '../actions'
import {
  showNotification,
  uploadFileFailure,
  uploadFileProgress,
  uploadFileSuccess,
} from '../actionCreators'
import { ajax } from './ajax'
import { authSessionSelector } from '../selectors'
import { fileConversion } from '../utils/file'
import { stringifyError } from '../utils/parse'

export interface BlobObject extends QBContentObject {
  blob_object_access: { params: string }
}

function createUploadChannel(file: File, blob: BlobObject, token: string) {
  const url = new URL(blob.blob_object_access.params)
  const body = new FormData()

  url.searchParams.forEach((value, key) => {
    body.append(key, value)
  })
  body.append('file', file)

  return eventChannel((emitter) => {
    ajax({
      method: 'POST',
      url: `${url.origin}${url.pathname}`,
      headers: { 'QB-Token': token },
      onProgress: (event) => {
        emitter(uploadFileProgress(event.loaded / event.total))
      },
      body,
      responseType: 'json',
    })
      .then((response) => {
        if (response.status < 200 || response.status > 299) {
          if (typeof response === 'string') {
            return emitter(uploadFileFailure(response))
          }

          if (
            typeof response.response === 'object' &&
            response.response !== null &&
            'errors' in response.response
          ) {
            const errorsArray = (response.response as { errors: string[] })
              .errors

            return emitter(uploadFileFailure(errorsArray[0]))
          }
        }

        return emitter(uploadFileSuccess(blob))
      })
      .catch(() => emitter(END))

    // eslint-disable-next-line react/function-component-definition
    return () => null
  })
}

function* createBlob(file: File, token: string) {
  const url = [
    'https://',
    QB.service.qbInst.config.endpoints.api,
    '/',
    QB.service.qbInst.config.urls.blobs,
    QB.service.qbInst.config.urls.type,
  ].join('')
  const response: {
    status: number
    response: { blob: BlobObject }
  } = yield call(ajax, {
    method: 'POST',
    url,
    headers: {
      'Content-Type': 'application/json',
      'QB-Token': token,
    },
    body: JSON.stringify({
      blob: {
        content_type: file.type,
        name: file.name,
      },
    }),
    responseType: 'json',
  })

  if (response.status < 200 || response.status > 299) {
    throw new Error('Failed to create a new blob')
  }

  return response.response.blob
}

function* markAsUploaded(blob: BlobObject, token: string) {
  const { id, size } = blob
  const url = [
    'https://',
    QB.service.qbInst.config.endpoints.api,
    '/',
    QB.service.qbInst.config.urls.blobs,
    '/',
    id,
    '/complete',
    QB.service.qbInst.config.urls.type,
  ].join('')
  const body = new FormData()

  body.append('size', size.toString())
  const response: { status: number; response: unknown } = yield call(ajax, {
    method: 'PUT',
    url,
    body,
    headers: { 'QB-Token': token },
    responseType: 'json',
  })

  if (response.status < 200 || response.status > 299) {
    throw new Error('Failed to mark file as uploaded')
  }

  return response.response
}

function* uploadFile(action: Types.QBContentUploadRequestAction) {
  const { file, then } = action.payload
  const session: ReturnType<typeof authSessionSelector> = yield select(
    authSessionSelector,
  )
  const token = session ? session.token : ''

  try {
    const convertedFile: SagaReturnType<typeof fileConversion> = yield call(
      fileConversion,
      file,
    )
    const blob: SagaReturnType<typeof createBlob> = yield call(
      createBlob,
      convertedFile,
      token,
    )

    blob.size = convertedFile.size

    const channel: EventChannel<AnyAction> = yield call(
      createUploadChannel,
      convertedFile,
      blob,
      token,
    )
    let result:
      | Types.QBContentUploadProgressAction
      | Types.QBContentUploadSuccessAction
      | Types.QBContentUploadFailureAction

    do {
      result = yield take(channel)

      if (result.type === Types.QB_FILE_UPLOAD_FAILURE) {
        throw new Error(result.error)
      }

      if (result.type === Types.QB_FILE_UPLOAD_SUCCESS) {
        yield call(markAsUploaded, blob, token)
        yield put(result)

        if (then) {
          then(result)
        }
      } else {
        yield put(result)
      }
    } while (result.type === Types.QB_FILE_UPLOAD_PROGRESS)
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(uploadFileFailure(errorMessage))
    yield put(
      showNotification({
        duration: 3 * SECOND,
        id: Date.now().toString(),
        message: errorMessage,
        position: 'bottom-center',
        type: 'error',
      }),
    )
  }
}

function* contentUploadFlow() {
  while (true) {
    const action: Types.QBContentUploadRequestAction = yield take(
      Types.QB_FILE_UPLOAD_REQUEST,
    )

    yield race([call(uploadFile, action), take(Types.QB_FILE_UPLOAD_CANCEL)])
  }
}

export default [contentUploadFlow()]
