import { QBSession, QBUser } from '@qc/quickblox'
import * as Types from '../actions'

export function login(payload: Types.LoginPayload): Types.QBLoginRequestAction {
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
