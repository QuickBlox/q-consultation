import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { QBAppointment } from '@qc/quickblox/dist/types'
import {
  authMyAccountSelector,
  callIsActiveSelector,
  callSessionSelector,
  createAppointmentByIdSelector,
  createUsersProviderByAppointmentIdSelector,
} from '../../selectors'
import { ROOT_ROUTE, SIGNUP_ROUTE } from '../../constants/routes'
import { createUseComponent, useActions } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import { logoutSuccess, stopCall, logout } from '../../actionCreators'

const createSelector = (appointmentId?: QBAppointment['_id']) =>
  createMapStateSelector({
    myAccount: authMyAccountSelector,
    currentAppointment: createAppointmentByIdSelector(appointmentId),
    currentProvider: createUsersProviderByAppointmentIdSelector(appointmentId),
    onCall: callIsActiveSelector,
    session: callSessionSelector,
  })

export default createUseComponent(() => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const { onCall, session } = store
  const actions = useActions({
    logoutSuccess,
    stopCall,
    logout,
  })

  const [isSignOut, setIsSignOut] = useState(false)
  const isOffline = useIsOffLine()

  const goToMainScreen = () => {
    navigate(ROOT_ROUTE)
  }

  const handleRegisterClick = async () => {
    await new Promise<void>((resolve) => {
      if (isOffline) {
        if (onCall && session) {
          const tracks = session.localStream?.getTracks()

          tracks?.forEach((track) => track.stop())
        }
        actions.logoutSuccess()
        resolve()
      } else if (onCall) {
        setIsSignOut(true)
        actions.stopCall()
        actions.logout(() => {
          resolve()
        })
      } else {
        actions.logout(() => {
          resolve()
        })
      }
    })

    navigate(SIGNUP_ROUTE)
  }

  return {
    store,
    data: { isOffline, isSignOut },
    handlers: { goToMainScreen, handleRegisterClick },
  }
})
