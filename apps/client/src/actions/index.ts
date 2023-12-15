import { AuthAction, QB_MY_ACCOUNT_UPDATE_SUCCESS } from './auth'
import { ModalAction } from './modal'
import { NotificationAction } from './notification'
import { QBAction } from './qb'
import {
  QBAppointmentAction,
  QB_APPOINTMENT_GET_SUCCESS,
  QB_APPOINTMENT_UPDATE_SUCCESS,
} from './qb-appointment'
import { QBChatAction } from './qb-chat'
import { QBContentAction, QB_FILE_UPLOAD_SUCCESS } from './qb-content'
import {
  QBDialogAction,
  QB_DIALOG_GET_SUCCESS,
  QB_DIALOG_CREATE_SUCCESS,
} from './qb-dialogs'
import {
  QBMessageAction,
  QB_CHAT_GET_MESSAGE_SUCCESS,
  QB_CHAT_MESSAGE,
  QB_CHAT_SYSTEM_MESSAGE,
  QB_CHAT_MESSAGE_DELIVERED,
  QB_CHAT_MESSAGE_READ,
  QB_CHAT_USER_TYPING,
} from './qb-messages'
import {
  QBUserAction,
  QB_USER_GET_SUCCESS,
  QB_USER_LIST_SUCCESS,
} from './qb-users'
import { QBWebRTCAction } from './qb-webrtc'
import { RephraseAction } from './rephrase'
import { TranslateAction } from './translate'
import { AvatarAction } from './avatar'

export * from './auth'
export * from './notification'
export * from './qb-appointment'
export * from './qb-chat'
export * from './qb-content'
export * from './qb-dialogs'
export * from './qb-messages'
export * from './qb-users'
export * from './qb-webrtc'
export * from './qb'
export * from './modal'
export * from './rephrase'
export * from './translate'
export * from './avatar'

export const API_SUCCESS_ACTIONS = [
  QB_APPOINTMENT_GET_SUCCESS,
  QB_APPOINTMENT_UPDATE_SUCCESS,
  QB_USER_GET_SUCCESS,
  QB_USER_LIST_SUCCESS,
  QB_MY_ACCOUNT_UPDATE_SUCCESS,
  QB_DIALOG_GET_SUCCESS,
  QB_DIALOG_CREATE_SUCCESS,
  QB_FILE_UPLOAD_SUCCESS,
  QB_CHAT_GET_MESSAGE_SUCCESS,
]

export const CHAT_RECEIVED_ACTIONS = [
  QB_CHAT_MESSAGE,
  QB_CHAT_SYSTEM_MESSAGE,
  QB_CHAT_MESSAGE_DELIVERED,
  QB_CHAT_MESSAGE_READ,
  QB_CHAT_USER_TYPING,
]

export type Action =
  | AuthAction
  | NotificationAction
  | QBAppointmentAction
  | QBChatAction
  | QBContentAction
  | QBDialogAction
  | QBMessageAction
  | QBUserAction
  | QBWebRTCAction
  | QBAction
  | ModalAction
  | RephraseAction
  | TranslateAction
  | AvatarAction
