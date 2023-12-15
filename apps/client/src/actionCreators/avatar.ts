import { QBUser } from '@qc/quickblox'
import * as Types from '../actions'

export function getUserAvatar(
  userId: QBUser['id'],
  then?: (
    action: Types.GetUserAvatarSuccessAction | Types.GetUserAvatarFailureAction,
  ) => void,
): Types.GetUserAvatarRequestAction {
  return { type: Types.GET_USER_AVATAR_REQUEST, payload: { userId, then } }
}

export function getUserAvatarSuccess(
  payload: Types.GetUserAvatarSuccessAction['payload'],
): Types.GetUserAvatarSuccessAction {
  return { type: Types.GET_USER_AVATAR_SUCCESS, payload }
}

export function getUserAvatarFailure(
  userId: QBUser['id'],
  error: string,
): Types.GetUserAvatarFailureAction {
  return { type: Types.GET_USER_AVATAR_FAILURE, payload: { userId }, error }
}

export function getMyAvatar(
  then?: (
    action: Types.GetMyAvatarSuccessAction | Types.GetMyAvatarFailureAction,
  ) => void,
): Types.GetMyAvatarRequestAction {
  return { type: Types.GET_MY_AVATAR_REQUEST, payload: { then } }
}

export function getMyAvatarSuccess(
  payload: Types.GetMyAvatarSuccessAction['payload'],
): Types.GetMyAvatarSuccessAction {
  return { type: Types.GET_MY_AVATAR_SUCCESS, payload }
}

export function getMyAvatarFailure(
  error: string,
): Types.GetMyAvatarFailureAction {
  return { type: Types.GET_MY_AVATAR_FAILURE, error }
}

export function setMyAvatar(
  file: File,
  then?: (
    action: Types.SetMyAvatarSuccessAction | Types.SetMyAvatarFailureAction,
  ) => void,
): Types.SetMyAvatarRequestAction {
  return { type: Types.SET_MY_AVATAR_REQUEST, payload: { file, then } }
}

export function setMyAvatarSuccess(
  payload: Types.SetMyAvatarSuccessAction['payload'],
): Types.SetMyAvatarSuccessAction {
  return { type: Types.SET_MY_AVATAR_SUCCESS, payload }
}

export function setMyAvatarFailure(
  error: string,
): Types.SetMyAvatarFailureAction {
  return { type: Types.SET_MY_AVATAR_FAILURE, error }
}

export function deleteMyAvatar(
  then?: (
    action:
      | Types.DeleteMyAvatarSuccessAction
      | Types.DeleteMyAvatarFailureAction,
  ) => void,
): Types.DeleteMyAvatarRequestAction {
  return { type: Types.DELETE_MY_AVATAR_REQUEST, payload: { then } }
}

export function deleteMyAvatarSuccess(): Types.DeleteMyAvatarSuccessAction {
  return { type: Types.DELETE_MY_AVATAR_SUCCESS }
}

export function deleteMyAvatarFailure(
  error: string,
): Types.DeleteMyAvatarFailureAction {
  return { type: Types.DELETE_MY_AVATAR_FAILURE, error }
}
