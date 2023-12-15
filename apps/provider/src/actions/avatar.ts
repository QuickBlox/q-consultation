import { QBUser } from '@qc/quickblox'
import { Action } from 'redux'

export const GET_USER_AVATAR_REQUEST = 'GET_USER_AVATAR_REQUEST'
export const GET_USER_AVATAR_SUCCESS = 'GET_USER_AVATAR_SUCCESS'
export const GET_USER_AVATAR_FAILURE = 'GET_USER_AVATAR_FAILURE'
export const GET_MY_AVATAR_REQUEST = 'GET_MY_AVATAR_REQUEST'
export const GET_MY_AVATAR_SUCCESS = 'GET_MY_AVATAR_SUCCESS'
export const GET_MY_AVATAR_FAILURE = 'GET_MY_AVATAR_FAILURE'
export const SET_MY_AVATAR_REQUEST = 'SET_MY_AVATAR_REQUEST'
export const SET_MY_AVATAR_SUCCESS = 'SET_MY_AVATAR_SUCCESS'
export const SET_MY_AVATAR_FAILURE = 'SET_MY_AVATAR_FAILURE'
export const DELETE_MY_AVATAR_REQUEST = 'DELETE_MY_AVATAR_REQUEST'
export const DELETE_MY_AVATAR_SUCCESS = 'DELETE_MY_AVATAR_SUCCESS'
export const DELETE_MY_AVATAR_FAILURE = 'DELETE_MY_AVATAR_FAILURE'

export interface GetUserAvatarSuccessAction extends Action {
  type: typeof GET_USER_AVATAR_SUCCESS
  payload: {
    userId: QBUser['id']
    blob: Blob
  }
}

export interface GetUserAvatarFailureAction extends Action {
  type: typeof GET_USER_AVATAR_FAILURE
  payload: { userId: QBUser['id'] }
  error: string
}

export interface GetUserAvatarRequestAction extends Action {
  type: typeof GET_USER_AVATAR_REQUEST
  payload: {
    userId: QBUser['id']
    then?: (
      action: GetUserAvatarSuccessAction | GetUserAvatarFailureAction,
    ) => void
  }
}

export interface GetMyAvatarSuccessAction extends Action {
  type: typeof GET_MY_AVATAR_SUCCESS
  payload: {
    blob: Blob
  }
}

export interface GetMyAvatarFailureAction extends Action {
  type: typeof GET_MY_AVATAR_FAILURE
  error: string
}

export interface GetMyAvatarRequestAction extends Action {
  type: typeof GET_MY_AVATAR_REQUEST
  payload: {
    then?: (action: GetMyAvatarSuccessAction | GetMyAvatarFailureAction) => void
  }
}

export interface SetMyAvatarSuccessAction extends Action {
  type: typeof SET_MY_AVATAR_SUCCESS
  payload: {
    blob: Blob | File
  }
}

export interface SetMyAvatarFailureAction extends Action {
  type: typeof SET_MY_AVATAR_FAILURE
  error: string
}

export interface SetMyAvatarRequestAction extends Action {
  type: typeof SET_MY_AVATAR_REQUEST
  payload: {
    file: File
    then?: (action: SetMyAvatarSuccessAction | SetMyAvatarFailureAction) => void
  }
}

export interface DeleteMyAvatarSuccessAction extends Action {
  type: typeof DELETE_MY_AVATAR_SUCCESS
}

export interface DeleteMyAvatarFailureAction extends Action {
  type: typeof DELETE_MY_AVATAR_FAILURE
  error: string
}

export interface DeleteMyAvatarRequestAction extends Action {
  type: typeof DELETE_MY_AVATAR_REQUEST
  payload: {
    then?: (
      action: DeleteMyAvatarSuccessAction | DeleteMyAvatarFailureAction,
    ) => void
  }
}

export type AvatarAction =
  | GetUserAvatarSuccessAction
  | GetUserAvatarRequestAction
  | GetUserAvatarFailureAction
  | GetMyAvatarSuccessAction
  | GetMyAvatarFailureAction
  | GetMyAvatarRequestAction
  | SetMyAvatarSuccessAction
  | SetMyAvatarFailureAction
  | SetMyAvatarRequestAction
  | DeleteMyAvatarSuccessAction
  | DeleteMyAvatarFailureAction
  | DeleteMyAvatarRequestAction
