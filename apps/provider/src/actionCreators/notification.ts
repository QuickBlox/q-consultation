import * as Types from '../actions'

export function showNotification(
  payload: Types.Notification,
): Types.ShowNotificationAction {
  return { type: Types.SHOW_NOTIFICATION, payload }
}

export function hideNotification(
  payload: Types.Notification['id'],
): Types.HideNotificationAction {
  return { type: Types.HIDE_NOTIFICATION, payload }
}
