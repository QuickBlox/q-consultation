import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useMatch } from 'react-router-dom'

import { APPOINTMENT_ROUTE } from '../../constants/routes'
import { createUseComponent, useScreenHeight } from '../../hooks'
import {
  authMyAccountSelector,
  callIsActiveSelector,
  modalOpenedSelector,
  qbProviderIdSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import { currentUserIsGuest } from '../../utils/user'

const selector = createMapStateSelector({
  myAccount: authMyAccountSelector,
  modalOpened: modalOpenedSelector,
  onCall: callIsActiveSelector,
  providerId: qbProviderIdSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const location = useLocation() as { state: { referrer?: string } }
  const appointmentRouteMatch = useMatch(APPOINTMENT_ROUTE)
  const height = useScreenHeight()
  const isOffline = useIsOffLine()
  const { myAccount, modalOpened, onCall, providerId } = store
  const isGuest = myAccount && currentUserIsGuest(myAccount)
  const isGuestAccess = isGuest && ENABLE_GUEST_CLIENT

  useEffect(() => {
    if (modalOpened || providerId || onCall) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [modalOpened, providerId, onCall])

  useEffect(() => {
    if (isOffline) {
      document.body.classList.add('offline')
    } else {
      document.body.classList.remove('offline')
    }

    return () => {
      document.body.classList.remove('offline')
    }
  }, [isOffline])

  return {
    store,
    data: {
      height,
      location,
      appointmentRouteMatch,
      isGuestAccess,
    },
  }
})
