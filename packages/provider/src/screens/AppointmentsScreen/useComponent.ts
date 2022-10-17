import { useEffect, useState } from 'react'
import { generatePath, useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { listUsers, showNotification } from '../../actionCreators'
import { createUseComponent, useActions } from '../../hooks'
import { APPOINTMENTS_ROUTE } from '../../constants/routes'
import { ChatTabs } from '../../constants/tabs'
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
  const history = useHistory()
  const store = useSelector(selector)
  const actions = useActions({
    listUsers,
    showNotification,
  })
  const { appointmentId: defaultAppointmentId, tab } = useParams<{
    appointmentId: QBAppointment['_id']
    tab: ChatTabs
  }>()
  const [appointmentId, selectAppointmentId] = useState<
    QBAppointment['_id'] | undefined
  >(defaultAppointmentId)
  const { appointmentEntries } = store

  useEffect(() => {
    if (appointmentId) {
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
            if (not_found.length) {
              actions.showNotification({
                id: Date.now().toString(),
                duration: 3 * SECOND,
                position: 'bottom-center',
                type: 'error',
                message: 'USER_NOT_ACTIVE',
                translate: true,
              })

              history.push(APPOINTMENTS_ROUTE)
            } else {
              const path = generatePath(APPOINTMENTS_ROUTE, {
                tab,
                appointmentId,
              })

              history.push(path)
            }
          },
        )
      }
    }
  }, [appointmentId])

  return {
    data: { appointmentId },
    handlers: {
      selectAppointmentId,
    },
  }
})
