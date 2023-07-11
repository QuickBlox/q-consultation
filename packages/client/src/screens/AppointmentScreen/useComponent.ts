import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, useHistory, useParams } from 'react-router-dom'

import {
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  authMyAccountSelector,
  createAppointmentByIdSelector,
} from '../../selectors'
import {
  getAppointments,
  createAppointment,
  createDialog,
  sendSystemMessage,
} from '../../actionCreators'
import { createUseComponent, useActions, useQuery } from '../../hooks'
import {
  APPOINTMENT_FINISH_ROUTE,
  APPOINTMENT_ROUTE,
  ROOT_ROUTE,
} from '../../constants/routes'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import {
  QBAppointmentCreateSuccessAction,
  QBAppointmentGetSuccessAction,
  QBDialogCreateSuccessAction,
} from '../../actions'
import {
  APPOINTMENT_NOTIFICATION,
  DIALOG_NOTIFICATION,
} from '../../constants/notificationTypes'
import { isGuestClient } from '../../utils/user'

const createSelector = (appointmentId?: QBAppointment['_id']) =>
  createMapStateSelector({
    loading: appointmentLoadingSelector,
    myAccountId: authMyAccountIdSelector,
    myAccount: authMyAccountSelector,
    appointment: createAppointmentByIdSelector(appointmentId),
  })

export default createUseComponent(() => {
  const { appointmentId } = useParams<Dictionary<string>>()
  const actions = useActions({
    getAppointments,
    createAppointment,
    createDialog,
    sendSystemMessage,
  })
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const isOffline = useIsOffLine()
  const { appointment, myAccountId } = store
  const history = useHistory()
  const { provider } = useQuery()
  const [chatOpen, setChatOpen] = useState<boolean>(false)
  const isGuestAccess =
    ENABLE_GUEST_CLIENT && store.myAccount && isGuestClient(store.myAccount)

  useEffect(() => {
    if (
      appointment &&
      ((appointment.date_end && !appointment.conclusion) ||
        appointment.client_id !== myAccountId)
    ) {
      const path =
        isGuestAccess && appointmentId
          ? generatePath(APPOINTMENT_FINISH_ROUTE, { appointmentId })
          : ROOT_ROUTE

      history.push(path)
    }
  }, [appointment, myAccountId, appointmentId])

  useEffect(() => {
    if (appointmentId) {
      const path = generatePath(APPOINTMENT_ROUTE, {
        appointmentId,
      })

      history.push(path)
    } else if (!isOffline && provider) {
      const providerId = Number(provider)

      actions.getAppointments(
        {
          client_id: myAccountId,
          provider_id: providerId,
          date_end: null,
          date_start: null,
          limit: 1,
        },
        (actionGetAppointment: QBAppointmentGetSuccessAction) => {
          const [currentAppointmentId] = Object.keys(
            actionGetAppointment.payload.entries,
          )

          if (currentAppointmentId) {
            const path = generatePath(APPOINTMENT_ROUTE, {
              appointmentId: currentAppointmentId,
            })

            history.push(path)
          } else {
            actions.createDialog({
              userId: providerId,
              then: (actionDialog: QBDialogCreateSuccessAction) => {
                actions.createAppointment({
                  client_id: myAccountId,
                  provider_id: providerId,
                  dialog_id: actionDialog.payload._id,
                  description: '',
                  then: (
                    actionAppointment: QBAppointmentCreateSuccessAction,
                  ) => {
                    const systemMessages = [
                      {
                        extension: {
                          notification_type: DIALOG_NOTIFICATION,
                          dialog_id: actionDialog.payload._id,
                        },
                      },
                      {
                        extension: {
                          notification_type: APPOINTMENT_NOTIFICATION,
                          appointment_id: actionAppointment.payload._id,
                        },
                      },
                    ]

                    systemMessages.forEach((systemMessage) => {
                      actions.sendSystemMessage({
                        dialogId: QB.chat.helpers.getUserJid(providerId),
                        message: systemMessage,
                      })
                    })
                    const path = generatePath(APPOINTMENT_ROUTE, {
                      appointmentId: actionAppointment.payload._id,
                    })

                    history.push(path)
                  },
                })
              },
            })
          }
        },
      )
    }
  }, [isOffline, provider])

  useEffect(() => {
    if (!isOffline && appointmentId) {
      actions.getAppointments({
        _id: appointmentId,
      })
    }
  }, [isOffline, appointmentId])

  return {
    store,
    data: { appointmentId, chatOpen },
    handlers: { setChatOpen },
  }
})
