import { QBConfig } from '@qc/quickblox'
import { Action } from 'redux'

export const QB_INIT_REQUEST = 'QB_INIT_REQUEST'
export const QB_INIT_SUCCESS = 'QB_INIT_SUCCESS'
export const QB_INIT_FAILURE = 'QB_INIT_FAILURE'

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

export type QBAction =
  | QBInitRequestAction
  | QBInitSuccessAction
  | QBInitFailureAction
