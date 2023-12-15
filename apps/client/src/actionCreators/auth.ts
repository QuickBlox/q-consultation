import { QBSession, QBUser } from '@qc/quickblox'
import * as Types from '../actions'

export function phoneLogin(payload: {
  login: string
  password: string
}): Types.QBPhoneLoginRequestAction {
  return { type: Types.QB_LOGIN_REQUEST, payload }
}

export function emailLogin(payload: {
  email: string
  password: string
}): Types.QBEmailLoginRequestAction {
  return { type: Types.QB_LOGIN_REQUEST, payload }
}

export function loginSuccess(payload: {
  session: QBSession
  user: QBUser
}): Types.QBLoginSuccessAction {
  return { type: Types.QB_LOGIN_SUCCESS, payload }
}

export function loginError(error: string): Types.QBLoginFailureAction {
  return { type: Types.QB_LOGIN_FAILURE, error }
}

export function loginByToken(
  token: QBSession['token'],
): Types.QBLoginByTokenRequestAction {
  return { type: Types.QB_LOGIN_BY_TOKEN_REQUEST, payload: { token } }
}

export function loginByTokenSuccess(payload: {
  session: QBSession
  user: QBUser
}): Types.QBLoginByTokenSuccessAction {
  return { type: Types.QB_LOGIN_BY_TOKEN_SUCCESS, payload }
}

export function loginByTokenError(
  error: string,
): Types.QBLoginByTokenFailureAction {
  return { type: Types.QB_LOGIN_BY_TOKEN_FAILURE, error }
}

export function logout(
  then?: (data: Types.LogoutSuccessAction) => void,
): Types.LogoutRequestAction {
  return {
    type: Types.LOGOUT_REQUEST,
    payload: { then },
  }
}

export function logoutSuccess(): Types.LogoutSuccessAction {
  return { type: Types.LOGOUT_SUCCESS }
}

export function logoutFailure(error: string): Types.LogoutFailureAction {
  return { type: Types.LOGOUT_FAILURE, error }
}

export function sessionUpdatedAt(
  updatedAt: string,
): Types.SessionUpdatedAtAction {
  return { type: Types.SESSION_UPDATED_AT, payload: updatedAt }
}

export function createAccount(
  data: Types.CreateAccount,
  then?: (data: Types.QBAccountCreateSuccessAction) => void,
): Types.QBAccountCreateRequestAction {
  return { type: Types.QB_ACCOUNT_CREATE_REQUEST, payload: { data, then } }
}

export function createAccountSuccess(payload: {
  session: QBSession
  user: QBUser
}): Types.QBAccountCreateSuccessAction {
  return { type: Types.QB_ACCOUNT_CREATE_SUCCESS, payload }
}

export function createAccountFailure(
  error: string,
): Types.QBAccountCreateFailureAction {
  return { type: Types.QB_ACCOUNT_CREATE_FAILURE, error }
}

export function updateMyAccount(
  data: Types.UpdateMyAccount,
  then?: (data: Types.QBMyAccountUpdateSuccessAction) => void,
): Types.QBMyAccountUpdateRequestAction {
  return { type: Types.QB_MY_ACCOUNT_UPDATE_REQUEST, payload: { data, then } }
}

export function updateMyAccountSuccess(
  payload: QBUser,
): Types.QBMyAccountUpdateSuccessAction {
  return { type: Types.QB_MY_ACCOUNT_UPDATE_SUCCESS, payload }
}

export function updateMyAccountFailure(
  error: string,
): Types.QBMyAccountUpdateFailureAction {
  return { type: Types.QB_MY_ACCOUNT_UPDATE_FAILURE, error }
}

export function clearAuthError(): Types.ClearAuthErrorAction {
  return { type: Types.CLEAR_AUTH_ERROR }
}
