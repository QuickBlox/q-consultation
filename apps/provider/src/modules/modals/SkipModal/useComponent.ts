import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import { useSelector } from 'react-redux'
import QB from '@qc/quickblox'

import { generatePath, useNavigate, useMatch } from 'react-router-dom'
import {
  leaveDialog,
  sendSystemMessage,
  toggleShowModal,
  updateAppointment,
  showNotification,
} from '../../../actionCreators'
import {
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  createAppointmentByIdSelector,
  dialogsEntriesSelector,
  modalAppointmentIdSelector,
  modalSkipSelector,
  usersSelectedModalAppointmentSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { combineSelectors } from '../../../utils/selectors'
import { APPOINTMENT_NOTIFICATION } from '../../../constants/notificationTypes'
import {
  APPOINTMENT_TYPE_ROUTE,
  SELECTED_APPOINTMENT_ROUTE,
} from '../../../constants/routes'
import { QUEUE_TYPE } from '../../../constants/tabs'

export interface SkipModalProps {
  onClose?: () => void
}

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    opened: modalSkipSelector,
    myAccountId: authMyAccountIdSelector,
    dialogs: dialogsEntriesSelector,
    loading: appointmentLoadingSelector,
    patient: usersSelectedModalAppointmentSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: SkipModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    leaveDialog,
    sendSystemMessage,
    toggleShowModal,
    updateAppointment,
    showNotification,
  })
  const { patient, dialogs, appointment, appointmentId } = store
  const matchAppointments = useMatch(SELECTED_APPOINTMENT_ROUTE)
  const navigate = useNavigate()

  const backdrop = useRef<HTMLDivElement>(null)
  const userName = patient
    ? patient.full_name || patient.login || patient.phone
    : ''

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'SkipModal' })

    if (onClose) {
      onClose()
    }
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const sendSystemMessageRemoveDialogAndClose = () => {
    if (appointment && dialogs) {
      const systemMessage = {
        extension: {
          notification_type: APPOINTMENT_NOTIFICATION,
          appointment_id: appointment._id,
        },
      }

      actions.sendSystemMessage({
        dialogId: QB.chat.helpers.getUserJid(appointment.client_id),
        message: systemMessage,
      })
      const dialog = dialogs[appointment.dialog_id]

      if (dialog) {
        actions.leaveDialog(dialog._id)
      }
    }
    actions.toggleShowModal({ modal: 'SkipModal' })

    if (onClose) {
      onClose()
    }

    if (
      matchAppointments &&
      appointmentId === matchAppointments.params.appointmentId
    ) {
      const path = generatePath(APPOINTMENT_TYPE_ROUTE, {
        appointmentType: matchAppointments.params.appointmentType || QUEUE_TYPE,
      })

      navigate(path)
    }
  }

  const skipAppointment = () => {
    if (appointment) {
      actions.updateAppointment({
        _id: appointment._id,
        data: {
          date_end: new Date().toISOString(),
        },
        then: sendSystemMessageRemoveDialogAndClose,
      })
    }
  }

  return {
    store,
    actions,
    refs: { backdrop },
    data: { userName },
    handlers: {
      skipAppointment,
      onBackdropClick,
      onCancelClick,
    },
  }
})
