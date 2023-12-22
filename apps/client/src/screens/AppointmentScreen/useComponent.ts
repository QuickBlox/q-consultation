import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { QBAppointment } from '@qc/quickblox/dist/types'
import QB from '@qc/quickblox'

import {
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  authMyAccountSelector,
  createAppointmentByIdSelector,
  createUsersProviderByAppointmentIdSelector,
} from '../../selectors'
import {
  getAppointments,
  createAppointment,
  listUsers,
  sendSystemMessage,
  showNotification,
  logout,
  getUser,
} from '../../actionCreators'
import {
  QBAppointmentCreateSuccessAction,
  QBAppointmentGetSuccessAction,
} from '../../actions'
import { createUseComponent, useActions, useQuery } from '../../hooks'
import {
  APPOINTMENT_FINISH_ROUTE,
  APPOINTMENT_ROUTE,
  PROVIDERS_ROUTE,
  ROOT_ROUTE,
} from '../../constants/routes'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import {
  APPOINTMENT_NOTIFICATION,
  DIALOG_NOTIFICATION,
} from '../../constants/notificationTypes'
import { currentUserIsGuest } from '../../utils/user'

const createSelector = (appointmentId?: QBAppointment['_id']) =>
  createMapStateSelector({
    loading: appointmentLoadingSelector,
    myAccountId: authMyAccountIdSelector,
    provider: createUsersProviderByAppointmentIdSelector(appointmentId),
    appointment: createAppointmentByIdSelector(appointmentId),
    myAccount: authMyAccountSelector,
  })

export default createUseComponent(() => {
  const { appointmentId } = useParams()
  const actions = useActions({
    getAppointments,
    createAppointment,
    sendSystemMessage,
    listUsers,
    showNotification,
    logout,
    getUser,
  })
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const isOffline = useIsOffLine()
  const { appointment, myAccountId, myAccount } = store
  const navigate = useNavigate()
  const { provider } = useQuery()
  const isGuest = myAccount && currentUserIsGuest(myAccount)
  const isGuestAccess = isGuest && ENABLE_GUEST_CLIENT
  const [chatOpen, setChatOpen] = useState(false)

  const handleNotAvailable = () => {
    navigate(PROVIDERS_ROUTE)
    actions.showNotification({
      duration: 3 * SECOND,
      id: Date.now().toString(),
      position: 'bottom-center',
      type: 'error',
      translate: true,
      message: 'USER_NOT_AVAILABLE',
    })
  }

  const handleAppointment = () => {
    if (!isOffline && appointmentId) {
      actions.getAppointments(
        {
          _id: appointmentId,
        },
        (actionGetAppointment) => {
          const [currentAppointment] = Object.values(
            actionGetAppointment.payload.entries,
          )

          if (currentAppointment) {
            actions.listUsers(
              {
                filter: {
                  field: 'id',
                  param: 'in',
                  value: [currentAppointment.provider_id],
                },
              },
              (actionListUser) => {
                const [providerEntry] = Object.values(
                  actionListUser.payload.entries,
                )

                if (!providerEntry) {
                  handleNotAvailable()
                }
              },
            )
          } else if (!currentAppointment) {
            handleNotAvailable()
          }
        },
      )
    }
  }

  useEffect(() => {
    if (
      (appointment &&
        ((appointment.date_end && !appointment.conclusion) ||
          appointment.client_id !== myAccountId)) ||
      (!appointmentId && !provider)
    ) {
      const path =
        isGuestAccess && appointmentId
          ? generatePath(APPOINTMENT_FINISH_ROUTE, { appointmentId })
          : ROOT_ROUTE

      navigate(path)
    }
  }, [appointment, myAccountId, appointmentId])

  useEffect(() => {
    if (appointmentId) {
      const path = generatePath(APPOINTMENT_ROUTE, {
        appointmentId,
      })

      navigate(path)
    } else if (!isOffline && provider) {
      const providerId = Number(provider)

      actions.getAppointments(
        {
          client_id: myAccountId,
          provider_id: providerId,
          date_end: null,
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

            navigate(path)
          } else {
            actions.createAppointment({
              client_id: myAccountId,
              provider_id: providerId,
              description: '',
              then: (actionAppointment: QBAppointmentCreateSuccessAction) => {
                const systemMessages = <const>[
                  {
                    extension: {
                      notification_type: DIALOG_NOTIFICATION,
                      dialog_id: actionAppointment.payload.dialog_id,
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

                navigate(path)
              },
            })
          }
        },
      )
    } else if (!isOffline && !appointmentId && isGuestAccess) {
      actions.getAppointments(
        {
          client_id: myAccountId,
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

            navigate(path)
          }
        },
      )
    }
  }, [isOffline, provider])

  useEffect(() => {
    handleAppointment()

    const handleSiteFocus = () => {
      handleAppointment()
    }

    window.addEventListener('focus', handleSiteFocus)

    return () => {
      window.removeEventListener('focus', handleSiteFocus)
    }
  }, [isOffline, appointmentId])

  return {
    store,
    data: { appointmentId, chatOpen },
    handlers: { setChatOpen },
  }
})
