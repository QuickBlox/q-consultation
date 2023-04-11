import { createSelector } from 'reselect'

import { StoreState } from '../reducers'
import { appointmentEntriesSelector } from './qb-appointment'

export const modalSelector = (state: StoreState) => state.modal

export const modalAppointmentIdSelector = createSelector(
  modalSelector,
  (modal) => modal.appointmentId,
)

export const modalProviderIdSelector = createSelector(
  modalSelector,
  (modal) => modal.providerId,
)

export const modalClientIdSelector = createSelector(
  modalSelector,
  (modal) => modal.clientId,
)

export const modalFileSelector = createSelector(
  modalSelector,
  (modal) => modal.file,
)

export const modalAppointmentUserIdSelector = createSelector(
  [modalAppointmentIdSelector, appointmentEntriesSelector],
  (appointmentId, appointmentEntries) =>
    appointmentId ? appointmentEntries[appointmentId]?.client_id : undefined,
)

export const modalAppointmentActionSelector = createSelector(
  modalSelector,
  (modal) => modal.AppointmentActionModal,
)

export const modalAssignSelector = createSelector(
  modalSelector,
  (modal) => modal.AssignModal,
)

export const modalCreateAppointmentSelector = createSelector(
  modalSelector,
  (modal) => modal.CreateAppointmentModal,
)

export const modalConclusionSelector = createSelector(
  modalSelector,
  (modal) => modal.ConclusionModal,
)

export const modalEditNotesSelector = createSelector(
  modalSelector,
  (modal) => modal.EditNotesModal,
)

export const modalFinishSelector = createSelector(
  modalSelector,
  (modal) => modal.FinishModal,
)

export const modalLogoutSelector = createSelector(
  modalSelector,
  (modal) => modal.LogoutModal,
)

export const modalLanguageSelector = createSelector(
  modalSelector,
  (modal) => modal.LanguageModal,
)

export const modalShareLinkSelector = createSelector(
  modalSelector,
  (modal) => modal.ShareLinkModal,
)

export const modalSkipSelector = createSelector(
  modalSelector,
  (modal) => modal.SkipModal,
)

export const modalCameraSelector = createSelector(
  modalSelector,
  (modal) => modal.CameraModal,
)

export const modalAppointmentChatSelector = createSelector(
  modalSelector,
  (modal) => modal.AppointmentDetailsModal,
)

export const modalSaveRecordSelector = createSelector(
  modalSelector,
  (modal) => modal.SaveRecordModal,
)

export const modalOpenedSelector = createSelector(
  modalSelector,
  (modal) =>
    modal.AppointmentDetailsModal ||
    modal.AssignModal ||
    modal.ConclusionModal ||
    modal.FinishModal ||
    modal.LogoutModal ||
    modal.LanguageModal ||
    modal.ShareLinkModal ||
    modal.SkipModal ||
    modal.CameraModal ||
    modal.AppointmentDetailsModal,
)
