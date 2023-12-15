import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, generatePath } from 'react-router-dom'

import { QBAppointment } from '@qc/quickblox/dist/types'
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
import { currentUserIsGuest } from '../../utils/user'

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
  const navigate = useNavigate()
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const { currentAppointment, currentProvider, myAccount } = store

  const [loadingConclusion, setLoadingConclusion] = useState(false)
  const isOffline = useIsOffLine()
  const isGuest = myAccount && currentUserIsGuest(myAccount)
  const isGuestAccess = isGuest && ENABLE_GUEST_CLIENT

  const goToMainScreen = () => {
    navigate(ROOT_ROUTE)
  }

  const onDownloadConclusion = () => {
    if (currentAppointment) {
      setLoadingConclusion(true)

      createPdf({
        lang: currentAppointment?.language || '',
        title: 'Conclusion',
        author: currentProvider?.full_name,
        content: currentAppointment.conclusion || '',
      }).download('Conclusion.pdf', () => {
        setLoadingConclusion(false)

        if (isGuestAccess && appointmentId) {
          const path = generatePath(APPOINTMENT_FINISH_ROUTE, { appointmentId })

          navigate(path)
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
