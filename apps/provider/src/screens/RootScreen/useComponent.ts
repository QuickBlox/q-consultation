import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'
import {
  APPOINTMENT_TYPE_ROUTE,
  SELECTED_APPOINTMENT_ROUTE,
} from '../../constants/routes'

import {
  createUseComponent,
  useMobileLayout,
  useScreenHeight,
} from '../../hooks'
import { callIsActiveSelector, modalOpenedSelector } from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

const selector = createMapStateSelector({
  onCall: callIsActiveSelector,
  modalOpened: modalOpenedSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const appointmentsRouteMatch = useMatch(APPOINTMENT_TYPE_ROUTE)
  const selectedAppointmentsRouteMatch = useMatch(SELECTED_APPOINTMENT_ROUTE)
  const RESOLUTION_XS = useMobileLayout()
  const screenHeight = useScreenHeight()
  const isOffline = useIsOffLine()

  const { modalOpened } = store

  const height = RESOLUTION_XS && isOffline ? screenHeight - 41 : screenHeight

  const handleToggleMenu = () => setIsOpenMenu(!isOpenMenu)

  useEffect(() => {
    if (modalOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [modalOpened])

  useEffect(() => {
    if (isOffline) {
      document.body.classList.add('offline')
    } else {
      document.body.classList.remove('offline')
    }
  }, [isOffline])

  return {
    store,
    data: {
      isOpenMenu,
      height,
      RESOLUTION_XS,
      appointmentsRouteMatch,
      selectedAppointmentsRouteMatch,
    },
    handlers: {
      handleToggleMenu,
    },
  }
})
