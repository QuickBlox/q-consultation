import { useState } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, useHistory } from 'react-router-dom'
import { currentUserIsGuest } from '../../utils/user'

import {
  authMyAccountSelector,
  createAppointmentByIdSelector,
  createUsersProviderByAppointmentIdSelector,
} from '../../selectors'
import { APPOINTMENT_FINISH_ROUTE, ROOT_ROUTE } from '../../constants/routes'
import { createUseComponent } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import { createPdf } from '../../utils/pdfFile'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface ConclusionProps {
  appointmentId?: QBAppointment['_id']
}

const createSelector = (appointmentId?: QBAppointment['_id']) =>
  createMapStateSelector({
    myAccount: authMyAccountSelector,
    currentAppointment: createAppointmentByIdSelector(appointmentId),
    currentProvider: createUsersProviderByAppointmentIdSelector(appointmentId),
  })

export default createUseComponent((props: ConclusionProps) => {
  const { appointmentId } = props
  const history = useHistory()
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const { currentAppointment, currentProvider, myAccount } = store

  const [loadingConclusion, setLoadingConclusion] = useState(false)
  const isOffline = useIsOffLine()
  const isGuest = myAccount && currentUserIsGuest(myAccount)
  const isGuestAccess = isGuest && GUEST_WAITING_ROOM_ONLY

  const goToMainScreen = () => {
    history.push(ROOT_ROUTE)
  }

  const onDownloadConclusion = () => {
    if (currentAppointment) {
      setLoadingConclusion(true)

      createPdf({
        lang: currentAppointment?.language,
        title: 'Conclusion',
        author: currentProvider?.full_name,
        content: currentAppointment.conclusion,
      }).download('Conclusion.pdf', () => {
        setLoadingConclusion(false)

        if (isGuestAccess && appointmentId) {
          const path = generatePath(APPOINTMENT_FINISH_ROUTE, { appointmentId })

          history.push(path)
        }
      })
    }
  }

  return {
    store,
    data: { loadingConclusion, isOffline, isGuestAccess },
    handlers: { onDownloadConclusion, goToMainScreen },
  }
})
