import * as Types from '../actions'

type QBInitActionParams = {
  appIdOrToken: string | number
  authKeyOrAppId: string | number
  authSecret?: string
  accountKey: string
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
