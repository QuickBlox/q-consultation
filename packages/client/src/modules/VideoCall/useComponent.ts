import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { createUseComponent, useActions } from '../../hooks'
import { getAppointments } from '../../actionCreators'
import {
  callDurationSelector,
  callSessionSelector,
  appointmentEntriesSelector,
  callAppointmentIdSelector,
  usersCallOpponentSelector,
  callIsActiveSelector,
  callOpponentIdSelector,
  dialogsHasUnreadCallSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'

const selector = createMapStateSelector({
  session: callSessionSelector,
  appointments: appointmentEntriesSelector,
  appointmentId: callAppointmentIdSelector,
  callDuration: callDurationSelector,
  onCall: callIsActiveSelector,
  opponent: usersCallOpponentSelector,
  opponentId: callOpponentIdSelector,
  hasUnreadMessage: dialogsHasUnreadCallSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({
    getAppointments,
  })
  const callScreenRef = useRef<HTMLDivElement>(null)
  const { appointments, appointmentId, onCall, opponent } = store
  const { t } = useTranslation()
  const [chatOpen, setChatOpen] = useState<boolean>(false)

  const videoCallName =
    opponent?.full_name ||
    opponent?.login ||
    opponent?.phone ||
    opponent?.email ||
    t('Unknown')

  useEffect(() => {
    if (onCall && appointmentId && !appointments[appointmentId]) {
      actions.getAppointments({
        _id: appointmentId,
      })
    }
  }, [onCall, appointmentId, appointments])

  return {
    store,
    data: {
      videoCallName,
      chatOpen,
    },
    actions,
    refs: {
      callScreenRef,
    },
    handlers: {
      setChatOpen,
    },
  }
})
