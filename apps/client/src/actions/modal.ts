import { Action } from 'redux'
import { UpdateMyAccount } from './auth'
import { CallRequestEvent } from './qb-webrtc'

export type ModalType =
  | 'AppointmentDetailsModal'
  | 'CameraModal'
  | 'CallModal'
  | 'ConsultationTopicModal'
  | 'LanguageModal'
  | 'LeaveQueueModal'
  | 'LogoutModal'
  | 'ProviderBiographyModal'

export const TOGGLE_SHOW_MODAL = 'TOGGLE_SHOW_MODAL'
export const TOGGLE_CALL_MODAL = 'TOGGLE_CALL_MODAL'

export interface ToggleShowModalAction extends Action {
  type: typeof TOGGLE_SHOW_MODAL
  payload: {
    modal: ModalType
    providerId?: QBUser['id']
    appointmentId?: QBAppointment['_id']
    userData?: UpdateMyAccount
    consultationTopic?: string
  }
}

export interface ToggleCallModalAction extends Action {
  type: typeof TOGGLE_CALL_MODAL
  payload?: CallRequestEvent['payload']
}

export type ModalAction = ToggleShowModalAction | ToggleCallModalAction
