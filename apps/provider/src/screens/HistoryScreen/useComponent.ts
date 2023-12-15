import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { startOfDay, endOfDay } from 'date-fns'

import { QBAppointment } from '@qc/quickblox'
import { getAppointments, toggleShowModal } from '../../actionCreators'
import { createUseComponent, useActions, useLocalGoBack } from '../../hooks'
import {
  appointmentHasMoreSelector,
  appointmentLoadingSelector,
  appointmentSkipSelector,
  authMyAccountIdSelector,
  createAppointmentListHistorySelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

const PER_PAGE = 20

const createSelector = () =>
  createMapStateSelector({
    myAccountId: authMyAccountIdSelector,
    appointmentList: createAppointmentListHistorySelector,
    appointmentLoading: appointmentLoadingSelector,
    appointmentHasMore: appointmentHasMoreSelector,
    appointmentSkip: appointmentSkipSelector,
  })

export default createUseComponent(() => {
  const [dateRange, setDateRange] = useState<Partial<DateRange>>({
    from: undefined,
    to: undefined,
  })
  const selector = createSelector()
  const store = useSelector(selector)
  const actions = useActions({ getAppointments, toggleShowModal })
  const isOffline = useIsOffLine()
  const onBack = useLocalGoBack()

  const {
    myAccountId,
    appointmentHasMore,
    appointmentLoading,
    appointmentSkip,
  } = store

  const handleChangeDate = (selectedDateRange: Partial<DateRange>) => {
    setDateRange(selectedDateRange)
  }

  const handleSelectAppointment = (appointmentId: QBAppointment['_id']) => {
    actions.toggleShowModal({ modal: 'AppointmentDetailsModal', appointmentId })
  }

  const handleGetAppointments = (skip = 0) => {
    if (!isOffline) {
      actions.getAppointments({
        filters: {
          provider_id: myAccountId,
          sort_desc: 'date_end',
          limit: PER_PAGE,
          skip,
          date_end: {
            gte: dateRange.from && startOfDay(dateRange.from).toISOString(),
            lte: dateRange.to && endOfDay(dateRange.to).toISOString(),
          },
        },
        reset: skip ? undefined : 'history',
      })
    }
  }

  const loadMoreAppointments = () => {
    if (appointmentLoading || !appointmentHasMore) return
    handleGetAppointments(appointmentSkip + PER_PAGE)
  }

  useEffect(() => {
    handleGetAppointments()
  }, [myAccountId, dateRange, isOffline])

  return {
    store,
    data: { dateRange },
    handlers: {
      handleChangeDate,
      handleSelectAppointment,
      onBack,
      loadMoreAppointments,
    },
  }
})
