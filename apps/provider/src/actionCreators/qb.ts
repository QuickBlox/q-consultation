import { QBConfig } from '@qc/quickblox'
import * as Types from '../actions'

type QBInitActionParams = {
  appId: number
  authKey: string
  authSecret?: string
  accountKey: string
  token: string
  config?: QBConfig
}

export function init(payload: QBInitActionParams): Types.QBInitRequestAction {
  return {
    type: Types.QB_INIT_REQUEST,
    payload,
  }
}

export function initFailed(error: string): Types.QBInitFailureAction {
  return { type: Types.QB_INIT_FAILURE, error }
}

export function initSuccess(): Types.QBInitSuccessAction {
  return { type: Types.QB_INIT_SUCCESS }
}
