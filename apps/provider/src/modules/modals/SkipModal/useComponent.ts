import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

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
  const { patient, dialogs, appointment } = store

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
      const dialog = dialogs[appointment.dialog_id]

      if (dialog) {
        actions.leaveDialog(dialog._id)
      }
    }
    actions.toggleShowModal({ modal: 'SkipModal' })

    if (onClose) {
      onClose()
    }
  }

  const skipAppointment = () => {
    if (appointment) {
      actions.updateAppointment({
        _id: appointment._id,
        data: {
          date_end: moment().toISOString(),
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
