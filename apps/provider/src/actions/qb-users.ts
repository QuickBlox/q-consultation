import {
  QBUser,
  ListUserParams,
  QBSession,
  QBCreateUserWithLogin,
  QBCreateUserWithEmail,
} from '@qc/quickblox'
import { Action } from 'redux'

export const QB_USER_GET_REQUEST = 'QB_USER_GET_REQUEST'
export const QB_USER_GET_SUCCESS = 'QB_USER_GET_SUCCESS'
export const QB_USER_GET_FAILURE = 'QB_USER_GET_FAILURE'
export const QB_USER_LIST_REQUEST = 'QB_USER_LIST_REQUEST'
export const QB_USER_LIST_SUCCESS = 'QB_USER_LIST_SUCCESS'
export const QB_USER_LIST_FAILURE = 'QB_USER_LIST_FAILURE'
export const QB_CREATE_USER_REQUEST = 'QB_CREATE_USER_REQUEST'
export const QB_CREATE_USER_SUCCESS = 'QB_CREATE_USER_SUCCESS'
export const QB_CREATE_USER_FAILURE = 'QB_CREATE_USER_FAILURE'
export const QB_USER_ERROR_RESET = 'QB_USER_ERROR_RESET'
export const QB_CREATE_GUEST_CLIENT_REQUEST = 'QB_CREATE_GUEST_CLIENT_REQUEST'
export const QB_CREATE_GUEST_CLIENT_SUCCESS = 'QB_CREATE_GUEST_CLIENT_SUCCESS'
export const QB_CREATE_GUEST_CLIENT_FAILURE = 'QB_CREATE_GUEST_CLIENT_FAILURE'

type GetUserParam =
  | { login: string }
  | { full_name: string }
  | { facebook_id: string }
  | { twitter_id: string }
  | { phone: string }
  | { email: string }
  | { tags: string | null }
  | { external: string }

export type GetUserParams = GetUserParam & {
  page?: number
  per_page?: number
  order?: string
}

export interface EntriesUserResponse {
  current_page: number
  entries: Dictionary<QBUser>
  list: string[]
  per_page: number
  total_entries: number
}

export interface QBUserGetSuccessAction extends Action {
  type: typeof QB_USER_GET_SUCCESS
  payload: EntriesUserResponse
}

export interface QBUserGetFailureAction extends Action {
  type: typeof QB_USER_GET_FAILURE
  payload: { error: string; data: GetUserParams }
}

export interface QBUserGetRequestAction extends Action {
  type: typeof QB_USER_GET_REQUEST
  payload: {
    data: GetUserParams
    then?: (data: QBUserGetSuccessAction | QBUserGetFailureAction) => void
  }
}

export interface QBUserListSuccessAction extends Action {
  type: typeof QB_USER_LIST_SUCCESS
  payload: EntriesUserResponse & {
    not_found: Array<QBUser['id']>
  }
}

export interface QBUserListRequestAction extends Action {
  type: typeof QB_USER_LIST_REQUEST
  payload: {
    data: ListUserParams
    then?: (data: QBUserListSuccessAction) => void
  }
}

export interface QBUserListFailureAction extends Action {
  type: typeof QB_USER_LIST_FAILURE
  error: string
}

type QBCreateUserParams = QBCreateUserWithLogin | QBCreateUserWithEmail

export interface QBCreateUserRequestAction extends Action {
  type: typeof QB_CREATE_USER_REQUEST
  payload: {
    user: QBCreateUserParams
    then?: (data: { session: QBSession; user: QBUser }) => void
  }
}

export interface QBCreateUserSuccessAction extends Action {
  type: typeof QB_CREATE_USER_SUCCESS
  payload: { session: QBSession; user: QBUser }
}

export interface QBCreateUserFailureAction extends Action {
  type: typeof QB_CREATE_USER_FAILURE
  error: string
}
export interface QBCreateGuestUserRequestAction extends Action {
  type: typeof QB_CREATE_GUEST_CLIENT_REQUEST
  payload: {
    userName: string
    then?: (data: { session: QBSession; user: QBUser }) => void
  }
}

export interface QBCreateGuestUserSuccessAction extends Action {
  type: typeof QB_CREATE_GUEST_CLIENT_SUCCESS
  payload: { session: QBSession; user: QBUser }
}

export interface QBCreateGuestUserFailureAction extends Action {
  type: typeof QB_CREATE_GUEST_CLIENT_FAILURE
  error: string
}

export interface QBUserErrorResetAction extends Action {
  type: typeof QB_USER_ERROR_RESET
}

export type QBUserAction =
  | QBUserGetRequestAction
  | QBUserGetSuccessAction
  | QBUserGetFailureAction
  | QBUserListRequestAction
  | QBUserListSuccessAction
  | QBUserListFailureAction
  | QBCreateUserRequestAction
  | QBCreateUserSuccessAction
  | QBCreateUserFailureAction
  | QBUserErrorResetAction
