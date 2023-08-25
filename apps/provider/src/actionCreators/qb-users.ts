import * as Types from '../actions'

export function getUser(
  data: Types.GetUserParams,
  then?: (
    data: Types.QBUserGetSuccessAction | Types.QBUserGetFailureAction,
  ) => void,
): Types.QBUserGetRequestAction {
  return { type: Types.QB_USER_GET_REQUEST, payload: { data, then } }
}

export function getUserSuccess(
  payload: Types.EntriesUserResponse,
): Types.QBUserGetSuccessAction {
  return { type: Types.QB_USER_GET_SUCCESS, payload }
}

export function getUserFailure(
  error: string,
  data: Types.GetUserParams,
): Types.QBUserGetFailureAction {
  return { type: Types.QB_USER_GET_FAILURE, payload: { error, data } }
}

export function listUsers(
  data: ListUserParams,
  then?: (data: Types.QBUserListSuccessAction) => void,
): Types.QBUserListRequestAction {
  return {
    type: Types.QB_USER_LIST_REQUEST,
    payload: {
      data,
      then,
    },
  }
}

export function listUsersSuccess(
  payload: Types.QBUserListSuccessAction['payload'],
): Types.QBUserListSuccessAction {
  return { type: Types.QB_USER_LIST_SUCCESS, payload }
}

export function listUsersFailure(error: string): Types.QBUserListFailureAction {
  return { type: Types.QB_USER_LIST_FAILURE, error }
}

export function resetUserError(): Types.QBUserErrorResetAction {
  return { type: Types.QB_USER_ERROR_RESET }
}

export function clearAppointmentsOfDeletedUsers(
  payload: Array<QBAppointment['_id']>,
): Types.QBClearAppointmentsOfDeletedUsers {
  return { type: Types.QB_CLEAR_APPOINTMENT_OF_DELETED_USERS, payload }
}

export function createGuestClient(
  userName: string,
  then?: Types.QBCreateUserRequestAction['payload']['then'],
): Types.QBCreateUserRequestAction {
  return {
    type: Types.QB_CREATE_GUEST_CLIENT_REQUEST,
    payload: {
      userName,
      then,
    },
  }
}

export function createGuestClientSuccess(payload: {
  session: QBSession
  user: QBUser
}): Types.QBCreateUserSuccessAction {
  return { type: Types.QB_CREATE_GUEST_CLIENT_SUCCESS, payload }
}

export function createGuestClientFailure(
  error: string,
): Types.QBCreateUserFailureAction {
  return { type: Types.QB_CREATE_GUEST_CLIENT_FAILURE, error }
}
