import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, useHistory } from 'react-router-dom'
import moment from 'moment'

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
import { isGuestClient } from '../../../utils/user'

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
  const history = useHistory()
  const actions = useActions({
    sendSystemMessage,
    updateAppointment,
    toggleShowModal,
  })
  const { appointment } = store

  const backdrop = useRef<HTMLDivElement>(null)
  const isOffline = useIsOffLine()
  const isGuestAccess =
    ENABLE_GUEST_CLIENT && store.myAccount && isGuestClient(store.myAccount)

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

  const canceledAppointment = () => {
    if (appointment) {
      actions.updateAppointment({
        _id: appointment._id,
        data: {
          date_end: moment().toISOString(),
        },
        then: () => {
          actions.toggleShowModal({ modal: 'LeaveQueueModal' })

          const path = isGuestAccess
            ? generatePath(APPOINTMENT_FINISH_ROUTE, {
                appointmentId: appointment._id,
              })
            : ROOT_ROUTE

          history.push(path)
        },
      })
    }
  }

  const handleLeaveQueue = () => {
    canceledAppointment()
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
