import { createSelector } from 'reselect'
import { QBChatDialog, QBAppointment } from '@qc/quickblox'
import { StoreState } from '../reducers'
import {
  appointmentCallSelector,
  createAppointmentByIdSelector,
} from './qb-appointment'

export const dialogsSelector = (state: StoreState) => state.dialogs

export const dialogsEntriesSelector = createSelector(
  dialogsSelector,
  (dialogs) => dialogs.entries,
)

export const dialogsErrorSelector = createSelector(
  dialogsSelector,
  (dialogs) => dialogs.error,
)

export const dialogsLoadingSelector = createSelector(
  dialogsSelector,
  (dialogs) => dialogs.loading,
)

export const createDialogsByIdSelector = (dialogId?: QBChatDialog['_id']) =>
  createSelector(dialogsEntriesSelector, (dialogs) =>
    dialogId ? dialogs[dialogId] : undefined,
  )

export const createDialogsByAppointmentIdSelector = (
  appointmentId?: QBAppointment['_id'],
) =>
  createSelector(
    [createAppointmentByIdSelector(appointmentId), dialogsEntriesSelector],
    (appointment, dialogs) =>
      appointment?.dialog_id ? dialogs[appointment.dialog_id] : undefined,
  )

export const createDialogsHasUnreadByAppointmentIdSelector = (
  appointmentId?: QBAppointment['_id'],
) =>
  createSelector(
    createDialogsByAppointmentIdSelector(appointmentId),
    (dialog) =>
      dialog
        ? typeof dialog.unread_messages_count === 'number' &&
          dialog.unread_messages_count > 0
        : false,
  )

export const dialogsCallSelector = createSelector(
  appointmentCallSelector,
  dialogsEntriesSelector,
  (appointment, dialogs) =>
    appointment?.dialog_id ? dialogs[appointment.dialog_id] : undefined,
)

export const dialogsHasUnreadCallSelector = createSelector(
  dialogsCallSelector,
  (dialog) =>
    dialog
      ? typeof dialog.unread_messages_count === 'number' &&
        dialog.unread_messages_count > 0
      : false,
)
