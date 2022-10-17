import { Action } from 'redux'

export type ModalType =
  | 'AppointmentActionModal'
  | 'AssignModal'
  | 'ConclusionModal'
  | 'EditNotesModal'
  | 'FinishModal'
  | 'LogoutModal'
  | 'ShareLinkModal'
  | 'SkipModal'
  | 'LanguageModal'
  | 'CameraModal'
  | 'AppointmentDetailsModal'

export const TOGGLE_SHOW_MODAL = 'TOGGLE_SHOW_MODAL'

export interface ToggleShowModalAction extends Action {
  type: typeof TOGGLE_SHOW_MODAL
  payload: {
    modal: ModalType
    providerId?: QBUser['id']
    clientId?: QBUser['id']
    appointmentId?: QBAppointment['_id']
  }
}

export type ModalAction = ToggleShowModalAction
