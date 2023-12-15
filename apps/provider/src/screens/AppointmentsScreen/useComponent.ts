import { useEffect, useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { QBAppointment } from '@qc/quickblox'

import { listUsers, showNotification } from '../../actionCreators'
import { createUseComponent, useActions } from '../../hooks'
import {
  APPOINTMENT_TYPE_ROUTE,
  SELECTED_APPOINTMENT_ROUTE,
} from '../../constants/routes'
import { ABOUT_TAB, AppointmentTypes, ChatTabs } from '../../constants/tabs'
import { createMapStateSelector } from '../../utils/selectors'
import { appointmentEntriesSelector } from '../../selectors'

export interface AppointmentsScreenProps {
  isOpenMenu: boolean
  toggleMenu: VoidFunction
}

const selector = createMapStateSelector({
  appointmentEntries: appointmentEntriesSelector,
})

export default createUseComponent(() => {
  const navigate = useNavigate()
  const store = useSelector(selector)
  const actions = useActions({
    listUsers,
    showNotification,
  })
  const {
    appointmentId: defaultAppointmentId,
    appointmentType,
    tab,
  } = useParams<{
    appointmentId: QBAppointment['_id']
    appointmentType: AppointmentTypes
    tab: ChatTabs
  }>()
  const [appointmentId, selectAppointmentId] = useState<
    QBAppointment['_id'] | undefined
  >(defaultAppointmentId)
  const { appointmentEntries } = store

  const handleGetAppointmentUser = () => {
    if (appointmentId && appointmentType) {
      const appointment = appointmentEntries[appointmentId]

      if (appointment) {
        actions.listUsers(
          {
            filter: {
              field: 'id',
              param: 'in',
              value: [appointment.client_id],
            },
          },
          ({ payload: { not_found } }) => {
            if (appointmentType) {
              if (not_found.length) {
                const path = generatePath(APPOINTMENT_TYPE_ROUTE, {
                  appointmentType,
                })

                actions.showNotification({
                  id: Date.now().toString(),
                  duration: 3 * SECOND,
                  position: 'bottom-center',
                  type: 'error',
                  message: 'USER_NOT_ACTIVE',
                  translate: true,
                })

                navigate(path)
              } else {
                const path = generatePath(SELECTED_APPOINTMENT_ROUTE, {
                  appointmentType,
                  tab: tab || ABOUT_TAB,
                  appointmentId,
                })

                navigate(path)
              }
            }
          },
        )
      }
    }
  }

  useEffect(() => {
    window.addEventListener('focus', handleGetAppointmentUser)

    return () => {
      window.removeEventListener('focus', handleGetAppointmentUser)
    }
  }, [appointmentId, appointmentEntries])

  return {
    data: { appointmentId: defaultAppointmentId, appointmentType, tab },
    handlers: {
      selectAppointmentId,
    },
  }
})
