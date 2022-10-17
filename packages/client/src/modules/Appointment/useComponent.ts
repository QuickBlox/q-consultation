import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { createUseComponent, useActions } from '../../hooks'
import {
  updateAppointment,
  sendSystemMessage,
  toggleShowModal,
} from '../../actionCreators'
import {
  authMyAccountSelector,
  createAppointmentByIdSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import { APPOINTMENT_NOTIFICATION } from '../../constants/notificationTypes'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface AppointmentProps {
  appointmentId?: QBAppointment['_id']
  onOpen: () => void
}

const createSelector = (appointmentId?: QBAppointment['_id']) =>
  createMapStateSelector({
    appointment: createAppointmentByIdSelector(appointmentId),
    myAccount: authMyAccountSelector,
  })

export default createUseComponent((props: AppointmentProps) => {
  const { appointmentId } = props
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const { appointment } = store
  const actions = useActions({
    updateAppointment,
    sendSystemMessage,
    toggleShowModal,
  })
  const isOffline = useIsOffLine()

  const [description, setDescription] = useState('')
  const [editingDescription, setEditingDescription] = useState(false)

  const startEditingDescription = () => setEditingDescription(true)

  const stopEditingDescription = () => {
    setEditingDescription(false)
    setDescription(appointment ? appointment.description : '')

    if (appointment) {
      const systemMessage = {
        extension: {
          notification_type: APPOINTMENT_NOTIFICATION,
          appointment_id: appointment._id,
        },
      }

      actions.sendSystemMessage({
        dialogId: QB.chat.helpers.getUserJid(appointment.provider_id),
        message: systemMessage,
      })
    }
  }

  const updateDescription = () => {
    if (
      appointment &&
      description &&
      appointment.description !== description.trim()
    ) {
      actions.updateAppointment({
        _id: appointment._id,
        data: { description: description.trim() },
        then: stopEditingDescription,
      })
    }
  }

  const changeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(value)
  }

  const toggleLeaveQueueModal = () =>
    actions.toggleShowModal({ modal: 'LeaveQueueModal', appointmentId })

  useEffect(() => {
    if (appointment) {
      setDescription(appointment.description || '')
    }
  }, [appointment])

  return {
    store,
    actions,
    data: {
      description,
      editingDescription,
      isOffline,
    },
    handlers: {
      changeDescription,
      startEditingDescription,
      stopEditingDescription,
      toggleLeaveQueueModal,
      updateDescription,
    },
  }
})
