import { TOptions } from 'i18next'
import { Action } from 'redux'

export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION'

type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left'

type NotificationType = 'success' | 'error' | 'cancel'

export interface Notification {
  duration?: number
  id: string
  message: string
  translate?: boolean
  translateOptions?: TOptions
  position?: NotificationPosition
  type?: NotificationType
}
export interface ShowNotificationAction extends Action {
  type: typeof SHOW_NOTIFICATION
  payload: Notification
}

export interface HideNotificationAction extends Action {
  type: typeof HIDE_NOTIFICATION
  payload: Notification['id']
}

export type NotificationAction = ShowNotificationAction | HideNotificationAction
