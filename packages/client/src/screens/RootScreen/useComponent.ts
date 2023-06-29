import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useRouteMatch } from 'react-router-dom'

import { APPOINTMENT_ROUTE } from '../../constants/routes'
import { createUseComponent, useActions, useScreenHeight } from '../../hooks'
import {
  authMyAccountSelector,
  callIsActiveSelector,
  modalOpenedSelector,
  qbProviderIdSelector,
  qbReadySelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import { getAppointments } from '../../actionCreators'
import { currentUserIsGuest } from '../../utils/user'

const selector = createMapStateSelector({
  myAccount: authMyAccountSelector,
  modalOpened: modalOpenedSelector,
  onCall: callIsActiveSelector,
  providerId: qbProviderIdSelector,
  ready: qbReadySelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({
    getAppointments,
  })
  const location = useLocation<{ referrer?: string }>()
  const appointmentRouteMatch = useRouteMatch(APPOINTMENT_ROUTE)
  const height = useScreenHeight()
  const isOffline = useIsOffLine()
  const { myAccount, modalOpened, onCall, providerId, ready } = store
  const isGuest = myAccount && currentUserIsGuest(myAccount)
  const isGuestAccess = isGuest && ENABLE_HAS_GUEST_CLIENT

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

  useEffect(() => {
    if (ready && myAccount) {
      actions.getAppointments({
        client_id: myAccount.id,
        limit: 1,
      })
    }
  }, [ready])

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
