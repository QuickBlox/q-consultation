import { QBConfig, QBUser } from '@qc/quickblox'
import { Action } from 'redux'

export const QB_SELECT_PROVIDER = 'QB_SELECT_PROVIDER'
export const QB_INIT_REQUEST = 'QB_INIT_REQUEST'
export const QB_INIT_SUCCESS = 'QB_INIT_SUCCESS'
export const QB_INIT_FAILURE = 'QB_INIT_FAILURE'
export const CLEAR_QB_ERROR = 'CLEAR_QB_ERROR'

export interface QBSelectProviderAction extends Action {
  type: typeof QB_SELECT_PROVIDER
  payload?: QBUser['id']
}

export interface QBInitRequestAction extends Action {
  type: typeof QB_INIT_REQUEST
  payload: {
    appId: number
    authKey: string
    authSecret?: string
    accountKey: string
    token: string
    config?: QBConfig
  }
}

export interface QBInitSuccessAction extends Action {
  type: typeof QB_INIT_SUCCESS
}

export interface QBInitFailureAction extends Action {
  type: typeof QB_INIT_FAILURE
  error: string
}

export interface ClearQBErrorAction extends Action {
  type: typeof CLEAR_QB_ERROR
}

export type QBAction =
  | QBSelectProviderAction
  | QBInitRequestAction
  | QBInitSuccessAction
  | QBInitFailureAction
  | ClearQBErrorAction
