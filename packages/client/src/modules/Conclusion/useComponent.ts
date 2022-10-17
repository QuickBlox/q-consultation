import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  authMyAccountSelector,
  createAppointmentByIdSelector,
  createUsersProviderByAppointmentIdSelector,
} from '../../selectors'
import { ROOT_ROUTE } from '../../constants/routes'
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
  const { currentAppointment, currentProvider } = store

  const [loadingConclusion, setLoadingConclusion] = useState(false)
  const isOffline = useIsOffLine()

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
      })
    }
  }

  return {
    store,
    data: { loadingConclusion, isOffline },
    handlers: { onDownloadConclusion, goToMainScreen },
  }
})
