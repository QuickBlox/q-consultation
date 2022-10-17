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
  code?: number,
): Types.QBUserGetFailureAction {
  return { type: Types.QB_USER_GET_FAILURE, payload: { message: error, code } }
}

export function listUsers(
  payload: ListUserParams,
): Types.QBUserListRequestAction {
  return { type: Types.QB_USER_LIST_REQUEST, payload }
}

export function listUsersSuccess(
  payload: Types.QBUserListSuccessAction['payload'],
): Types.QBUserListSuccessAction {
  return { type: Types.QB_USER_LIST_SUCCESS, payload }
}

export function listUsersFailure(error: string): Types.QBUserListFailureAction {
  return { type: Types.QB_USER_LIST_FAILURE, error }
}
