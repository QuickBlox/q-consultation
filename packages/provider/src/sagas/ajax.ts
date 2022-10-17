/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CANCEL } from 'redux-saga'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD'

export interface AjaxResponse {
  /** Status code of the request */
  status: number
  /** Response returned from remote (or `null`) */
  response: unknown
}

interface AjaxParams {
  method: HttpMethod
  url: string
  body?: XMLHttpRequestBodyInit
  responseType?: XMLHttpRequestResponseType
  onProgress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void
  headers?: Dictionary<string>
  username?: string
  password?: string
  async?: boolean
}

export function ajax(params: AjaxParams): Promise<AjaxResponse> {
  const {
    async = true,
    body,
    headers,
    method,
    onProgress,
    password,
    responseType,
    url,
    username,
  } = params
  const xhr = new XMLHttpRequest()
  const request = new Promise<AjaxResponse>((resolve, reject) => {
    xhr.open(method, url, async, username, password)

    if (typeof responseType !== 'undefined') {
      xhr.responseType = responseType
    }

    if (typeof headers !== 'undefined') {
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key])
      })
    }

    if (typeof onProgress === 'function') {
      xhr.addEventListener('progress', onProgress)
      xhr.upload.addEventListener('progress', onProgress)
    }
    function onLoad() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const response: AjaxResponse = {
          status: xhr.status,
          response: xhr.response,
        }

        resolve(response)
      }
    }
    function onError() {
      reject(new Error('An error occurred during the transaction'))
    }
    xhr.addEventListener('load', onLoad)
    xhr.addEventListener('error', onError)
    xhr.upload.addEventListener('load', onLoad)
    xhr.upload.addEventListener('error', onError)

    xhr.send(body)
  })

  ;(request as any)[CANCEL] = () => xhr.abort()

  return request
}
