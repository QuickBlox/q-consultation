import { createSelector } from 'reselect'

import { StoreState } from '../reducers'

export const modalSelector = (state: StoreState) => state.modal

export const modalProviderIdSelector = createSelector(
  modalSelector,
  (modal) => modal.providerId,
)

export const modalAppointmentIdSelector = createSelector(
  modalSelector,
  (modal) => modal.appointmentId,
)

export const modalUserDataSelector = createSelector(
  modalSelector,
  (modal) => modal.userData,
)

export const modalCallDataSelector = createSelector(
  modalSelector,
  (modal) => modal.callData,
)

export const modalAppointmentChatSelector = createSelector(
  modalSelector,
  (modal) => modal.AppointmentDetailsModal,
)

export const modalCameraSelector = createSelector(
  modalSelector,
  (modal) => modal.CameraModal,
)

export const modalCallSelector = createSelector(
  modalSelector,
  (modal) => modal.CallModal,
)

export const modalConsultationTopicSelector = createSelector(
  modalSelector,
  (modal) => modal.ConsultationTopicModal,
)

export const modalLanguageSelector = createSelector(
  modalSelector,
  (modal) => modal.LanguageModal,
)

export const modalLogoutSelector = createSelector(
  modalSelector,
  (modal) => modal.LogoutModal,
)

export const modalLeaveQueueSelector = createSelector(
  modalSelector,
  (modal) => modal.LeaveQueueModal,
)

export const modalTimeNotAvailableSelector = createSelector(
  modalSelector,
  (modal) => modal.TimeNotAvailableModal,
)

export const modalApproveNewAppointmentSelector = createSelector(
  modalSelector,
  (modal) => modal.ApproveNewAppointmentModal,
)

export const modalProviderBiographySelector = createSelector(
  modalSelector,
  (modal) => modal.ProviderBiographyModal,
)

export const modalOpenedSelector = createSelector(
  modalSelector,
  (modal) =>
    modal.AppointmentDetailsModal ||
    modal.CameraModal ||
    modal.CallModal ||
    modal.ConsultationTopicModal ||
    modal.LanguageModal ||
    modal.LogoutModal ||
    modal.LeaveQueueModal ||
    modal.TimeNotAvailableModal ||
    modal.ApproveNewAppointmentModal ||
    modal.ProviderBiographyModal,
)
