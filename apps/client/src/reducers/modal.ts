import * as Types from '../actions'

export type ModalReducer = {
  [T in Types.ModalType]: boolean
} & {
  providerId?: QBUser['id']
  appointmentId?: QBAppointment['_id']
  userData?: Types.UpdateMyAccount
  callData?: Types.CallRequestEvent['payload']
  consultationTopic?: string
}

const initialState: ModalReducer = {
  providerId: undefined,
  appointmentId: undefined,
  AppointmentDetailsModal: false,
  CameraModal: false,
  CallModal: false,
  ConsultationTopicModal: false,
  LanguageModal: false,
  LeaveQueueModal: false,
  LogoutModal: false,
  ProviderBiographyModal: false,
}

type ModalAction =
  | Types.ModalAction
  | Types.LogoutSuccessAction
  | Types.QBInitFailureAction
  | Types.SessionCloseEvent

export default (state = initialState, action: ModalAction) => {
  switch (action.type) {
    case Types.TOGGLE_SHOW_MODAL:
      return {
        ...state,
        [action.payload.modal]: !state[action.payload.modal],
        providerId: action.payload.providerId,
        appointmentId: action.payload.appointmentId,
        userData: action.payload.userData,
        consultationTopic: action.payload.consultationTopic,
      }
    case Types.TOGGLE_CALL_MODAL:
      return {
        ...state,
        CallModal: !state.CallModal,
        callData: action.payload,
      }
    case Types.SESSION_CLOSE:
      return {
        ...state,
        CallModal: false,
        callData: undefined,
      }
    case Types.LOGOUT_SUCCESS:
    case Types.QB_INIT_FAILURE:
      return initialState
    default:
      return state
  }
}
