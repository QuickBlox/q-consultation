import { ListUserParams, QBUser } from '@qc/quickblox'
import { Action } from 'redux'

export const QB_USER_GET_REQUEST = 'QB_USER_GET_REQUEST'
export const QB_USER_GET_SUCCESS = 'QB_USER_GET_SUCCESS'
export const QB_USER_GET_FAILURE = 'QB_USER_GET_FAILURE'
export const QB_USER_LIST_REQUEST = 'QB_USER_LIST_REQUEST'
export const QB_USER_LIST_SUCCESS = 'QB_USER_LIST_SUCCESS'
export const QB_USER_LIST_FAILURE = 'QB_USER_LIST_FAILURE'
export const QB_PROVIDERS_SUGGESTIONS_REQUEST =
  'QB_PROVIDERS_SUGGESTIONS_REQUEST'
export const QB_PROVIDERS_SUGGESTIONS_SUCCESS =
  'QB_PROVIDERS_SUGGESTIONS_SUCCESS'
export const QB_PROVIDERS_SUGGESTIONS_FAILURE =
  'QB_PROVIDERS_SUGGESTIONS_FAILURE'

type GetUserParam =
  | { login: string }
  | { full_name: string }
  | { facebook_id: string }
  | { twitter_id: string }
  | { phone: string }
  | { email: string }
  | { tags: string | string[] }
  | { external: string }

export type GetUserParams = GetUserParam & {
  page?: number
  per_page?: number
}

export interface EntriesUserResponse {
  current_page: number
  entries: Dictionary<QBUser>
  per_page: number
  total_entries: number
  reset?: boolean
}

export interface QBUserGetSuccessAction extends Action {
  type: typeof QB_USER_GET_SUCCESS
  payload: EntriesUserResponse
}

export interface QBUserGetFailureAction extends Action {
  type: typeof QB_USER_GET_FAILURE
  payload: {
    message: string
    code?: number
  }
}

export interface QBUserGetRequestAction extends Action {
  type: typeof QB_USER_GET_REQUEST
  payload: {
    data: GetUserParams
    reset?: boolean
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

export interface QBProvidersByTopicRequestAction extends Action {
  type: typeof QB_PROVIDERS_SUGGESTIONS_REQUEST
  payload: string
}

export interface QBProvidersByTopicSuccessAction extends Action {
  type: typeof QB_PROVIDERS_SUGGESTIONS_SUCCESS
  payload: Array<QBUser['id']>
}

export interface QBProvidersByTopicFailureAction extends Action {
  type: typeof QB_PROVIDERS_SUGGESTIONS_FAILURE
  error: string
}

export type QBUserAction =
  | QBUserGetRequestAction
  | QBUserGetSuccessAction
  | QBUserGetFailureAction
  | QBUserListRequestAction
  | QBUserListSuccessAction
  | QBUserListFailureAction
  | QBProvidersByTopicRequestAction
  | QBProvidersByTopicSuccessAction
  | QBProvidersByTopicFailureAction
