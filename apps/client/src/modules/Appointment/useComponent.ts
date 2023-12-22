import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import QB, { userHasTag } from '@qc/quickblox'

import { QBAppointment } from '@qc/quickblox/dist/types'
import { createUseComponent, useActions } from '../../hooks'
import {
  updateAppointment,
  sendSystemMessage,
  toggleShowModal,
} from '../../actionCreators'
import {
  authMyAccountSelector,
  createAppointmentByIdSelector,
  createUsersProviderByAppointmentIdSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import { APPOINTMENT_NOTIFICATION } from '../../constants/notificationTypes'
import useIsOffLine from '../../hooks/useIsOffLine'
import { APPOINTMENT_ROUTE } from '../../constants/routes'

export interface AppointmentProps {
  appointmentId?: QBAppointment['_id']
  onOpen: () => void
}

const createSelector = (appointmentId?: QBAppointment['_id']) =>
  createMapStateSelector({
    appointment: createAppointmentByIdSelector(appointmentId),
    provider: createUsersProviderByAppointmentIdSelector(appointmentId),
    myAccount: authMyAccountSelector,
  })

export default createUseComponent((props: AppointmentProps) => {
  const { appointmentId } = props
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const { appointment, provider } = store
  const actions = useActions({
    updateAppointment,
    sendSystemMessage,
    toggleShowModal,
  })
  const navigate = useNavigate()
  const isOffline = useIsOffLine()
  const isNotAssistant = provider && !userHasTag(provider, 'bot')

  const [description, setDescription] = useState('')
  const [editingDescription, setEditingDescription] = useState(false)

  const startEditingDescription = () => setEditingDescription(true)

  const stopEditingDescription = () => {
    setEditingDescription(false)
    setDescription(appointment?.description || '')
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
        then: () => {
          setEditingDescription(false)

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
        },
      })
    }
  }

  const changeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(value)
  }

  const handleOpenChat = () => {
    if (appointmentId) {
      const path = generatePath(APPOINTMENT_ROUTE, {
        appointmentId,
      })

      navigate(path, { replace: true, state: { chatOpen: true } })
    }
  }

  const toggleLeaveQueueModal = () =>
    actions.toggleShowModal({ modal: 'LeaveQueueModal', appointmentId })

  useEffect(() => {
    if (appointment && !description) {
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
      isNotAssistant,
    },
    handlers: {
      changeDescription,
      startEditingDescription,
      stopEditingDescription,
      toggleLeaveQueueModal,
      updateDescription,
      handleOpenChat,
    },
  }
})
