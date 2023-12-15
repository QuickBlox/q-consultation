import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, generatePath } from 'react-router-dom'
import QB from '@qc/quickblox'

import {
  sendSystemMessage,
  updateAppointment,
  toggleShowModal,
} from '../../../actionCreators'
import {
  appointmentLoadingSelector,
  authMyAccountSelector,
  createAppointmentByIdSelector,
  modalAppointmentIdSelector,
  modalLeaveQueueSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { APPOINTMENT_FINISH_ROUTE, ROOT_ROUTE } from '../../../constants/routes'
import { combineSelectors } from '../../../utils/selectors'
import { APPOINTMENT_NOTIFICATION } from '../../../constants/notificationTypes'
import useIsOffLine from '../../../hooks/useIsOffLine'
import { currentUserIsGuest } from '../../../utils/user'

export interface LeaveQueueModalProps {
  onClose?: () => void
}

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    loading: appointmentLoadingSelector,
    opened: modalLeaveQueueSelector,
    myAccount: authMyAccountSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: LeaveQueueModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const navigate = useNavigate()
  const actions = useActions({
    sendSystemMessage,
    updateAppointment,
    toggleShowModal,
  })
  const { appointment, myAccount } = store

  const backdrop = useRef<HTMLDivElement>(null)
  const isOffline = useIsOffLine()
  const isGuest = myAccount && currentUserIsGuest(myAccount)
  const isGuestAccess = isGuest && ENABLE_GUEST_CLIENT

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'LeaveQueueModal' })

    if (onClose) {
      onClose()
    }
  }

  const handleBackdropClick = (
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const handleLeaveQueue = () => {
    if (appointment) {
      actions.updateAppointment({
        _id: appointment._id,
        data: {
          date_end: new Date().toISOString(),
        },
        then: () => {
          const systemMessage = {
            extension: {
              notification_type: APPOINTMENT_NOTIFICATION,
              appointment_id: appointment._id,
            },
          }

          actions.sendSystemMessage({
            dialogId: QB.chat.helpers.getUserJid(appointment.provider_id),
            message: systemMessage,
            then: () => {
              actions.toggleShowModal({ modal: 'LeaveQueueModal' })

              const path = isGuestAccess
                ? generatePath(APPOINTMENT_FINISH_ROUTE, {
                    appointmentId: appointment._id,
                  })
                : ROOT_ROUTE

              navigate(path)
            },
          })
        },
      })
    }
  }

  return {
    store,
    actions,
    data: { isOffline },
    refs: { backdrop },
    handlers: {
      handleBackdropClick,
      handleLeaveQueue,
      onCancelClick,
    },
  }
})
