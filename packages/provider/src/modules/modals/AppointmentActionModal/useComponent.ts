import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import * as Types from '../../../actions'
import { createUseComponent, useActions } from '../../../hooks'
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
  modalAppointmentActionSelector,
  modalAppointmentIdSelector,
  usersSelectedModalAppointmentSelector,
} from '../../../selectors'
import { combineSelectors } from '../../../utils/selectors'
import { APPOINTMENT_NOTIFICATION } from '../../../constants/notificationTypes'

export interface AppointmentActionModalProps {
  onClose?: () => void
}

const userNotActiveNotification = <const>{
  duration: 3 * SECOND,
  position: 'bottom-center',
  type: 'error',
  message: 'USER_NOT_ACTIVE',
  translate: true,
}

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    myAccountId: authMyAccountIdSelector,
    dialogs: dialogsEntriesSelector,
    loading: appointmentLoadingSelector,
    opened: modalAppointmentActionSelector,
    client: usersSelectedModalAppointmentSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: AppointmentActionModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    leaveDialog,
    sendSystemMessage,
    toggleShowModal,
    updateAppointment,
    showNotification,
  })
  const { appointmentId, client, dialogs, appointment } = store
  const backdrop = useRef<HTMLDivElement>(null)

  const userName = client
    ? client.full_name || client.login || client.phone
    : ''

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      actions.toggleShowModal({ modal: 'AppointmentActionModal' })

      if (onClose) {
        onClose()
      }
    }
  }

  const sendSystemMessageRemoveDialogAndClose = (
    action:
      | Types.QBAppointmentUpdateSuccessAction
      | Types.QBAppointmentUpdateFailureAction,
  ) => {
    if (
      action.type === Types.QB_APPOINTMENT_UPDATE_FAILURE &&
      action.payload.data?.code === 404
    ) {
      actions.showNotification({
        ...userNotActiveNotification,
        id: Date.now().toString(),
      })
    } else if (appointment) {
      const dialog = dialogs[appointment.dialog_id]

      if (dialog) {
        actions.leaveDialog(dialog._id)
      }
    }

    actions.toggleShowModal({ modal: 'AppointmentActionModal' })

    if (onClose) {
      onClose()
    }
  }

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'AppointmentActionModal' })

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

  const finishAppointment = () => {
    actions.toggleShowModal({ modal: 'AppointmentActionModal', appointmentId })
    actions.toggleShowModal({ modal: 'ConclusionModal', appointmentId })
  }

  return {
    store,
    actions,
    refs: { backdrop },
    data: { userName },
    handlers: {
      onBackdropClick,
      onCancelClick,
      skipAppointment,
      finishAppointment,
    },
  }
})
