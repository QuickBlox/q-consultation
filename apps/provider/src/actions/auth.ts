import { QBSession, QBUser, QBUserCustomData } from '@qc/quickblox'
import { Action } from 'redux'

export const QB_LOGIN_REQUEST = 'QB_LOGIN_REQUEST'
export const QB_LOGIN_FAILURE = 'QB_LOGIN_FAILURE'
export const QB_LOGIN_SUCCESS = 'QB_LOGIN_SUCCESS'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const SESSION_UPDATED_AT = 'SESSION_UPDATED_AT'
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR'

export const QB_MY_ACCOUNT_UPDATE_REQUEST = 'QB_MY_ACCOUNT_UPDATE_REQUEST'
export const QB_MY_ACCOUNT_UPDATE_SUCCESS = 'QB_MY_ACCOUNT_UPDATE_SUCCESS'
export const QB_MY_ACCOUNT_UPDATE_FAILURE = 'QB_MY_ACCOUNT_UPDATE_FAILURE'

export type LoginPayload =
  | { login: string; password: string }
  | { email: string; password: string }
  | { token: string }

export interface QBLoginRequestAction extends Action {
  type: typeof QB_LOGIN_REQUEST
  payload: LoginPayload
}

export interface QBLoginFailureAction extends Action {
  type: typeof QB_LOGIN_FAILURE
  error: string
}

export interface QBLoginSuccessAction extends Action {
  type: typeof QB_LOGIN_SUCCESS
  payload: { session: QBSession; user: QBUser }
}

export interface LogoutSuccessAction extends Action {
  type: typeof LOGOUT_SUCCESS
}

export interface LogoutRequestAction extends Action {
  type: typeof LOGOUT_REQUEST
  payload: { then?: (data: LogoutSuccessAction) => void }
}

export interface LogoutFailureAction extends Action {
  type: typeof LOGOUT_FAILURE
  error: string
}

export interface SessionUpdatedAtAction extends Action {
  type: typeof SESSION_UPDATED_AT
  payload: string
}

export type UpdateMyAccount = Partial<Omit<QBUser, 'id' | 'custom_data'>> &
  Omit<QBUserCustomData, 'avatar'>

export interface QBMyAccountUpdateSuccessAction extends Action {
  type: typeof QB_MY_ACCOUNT_UPDATE_SUCCESS
  payload: QBUser
}

export interface QBMyAccountUpdateRequestAction extends Action {
  type: typeof QB_MY_ACCOUNT_UPDATE_REQUEST
  payload: {
    data: UpdateMyAccount
    then?: (data: QBMyAccountUpdateSuccessAction) => void
  }
}

export interface QBMyAccountUpdateFailureAction extends Action {
  type: typeof QB_MY_ACCOUNT_UPDATE_FAILURE
  error: string
}

export interface ClearAuthErrorAction extends Action {
  type: typeof CLEAR_AUTH_ERROR
}

export type AuthAction =
  | QBLoginRequestAction
  | QBLoginFailureAction
  | QBLoginSuccessAction
  | LogoutFailureAction
  | LogoutRequestAction
  | LogoutSuccessAction
  | SessionUpdatedAtAction
  | ClearAuthErrorAction
  | QBMyAccountUpdateRequestAction
  | QBMyAccountUpdateSuccessAction
  | QBMyAccountUpdateFailureAction
