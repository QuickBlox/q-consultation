import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { QBUser, QBAppointment } from '@qc/quickblox'
import { toggleShowModal, getAppointments } from '../../actionCreators'
import {
  appointmentHasMoreSelector,
  appointmentLoadingSelector,
  appointmentSkipSelector,
  authMyAccountIdSelector,
  createAppointmentListHistoryByClientIdSelector,
  usersEntriesSelector,
} from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface ChatHistoryTabProps {
  clientId?: QBUser['id']
}

const PER_PAGE = 20

const createSelector = (clientId?: QBUser['id']) =>
  createMapStateSelector({
    appointmentList: createAppointmentListHistoryByClientIdSelector(clientId),
    userEntries: usersEntriesSelector,
    myAccountId: authMyAccountIdSelector,
    appointmentLoading: appointmentLoadingSelector,
    appointmentHasMore: appointmentHasMoreSelector,
    appointmentSkip: appointmentSkipSelector,
  })

export default createUseComponent((props: ChatHistoryTabProps) => {
  const { clientId } = props
  const selector = createSelector(clientId)
  const store = useSelector(selector)
  const actions = useActions({
    toggleShowModal,
    getAppointments,
  })
  const isOffline = useIsOffLine()

  const {
    myAccountId,
    appointmentHasMore,
    appointmentLoading,
    appointmentSkip,
  } = store

  const handleOpenAppointmentChatModal = (
    currentAppointmentId: QBAppointment['_id'],
  ) => {
    actions.toggleShowModal({
      modal: 'AppointmentDetailsModal',
      appointmentId: currentAppointmentId,
    })
  }

  const handleGetAppointments = (skip = 0) => {
    if (!isOffline) {
      actions.getAppointments({
        filters: {
          date_end: { ne: null },
          provider_id: myAccountId,
          client_id: clientId,
          sort_desc: 'date_end',
          limit: PER_PAGE,
          skip,
        },
      })
    }
  }

  const loadMoreAppointments = () => {
    if (appointmentLoading || !appointmentHasMore) return
    handleGetAppointments(appointmentSkip + PER_PAGE)
  }

  useEffect(() => {
    handleGetAppointments()
  }, [myAccountId, clientId, isOffline])

  return {
    store,
    actions,
    handlers: {
      handleOpenAppointmentChatModal,
      loadMoreAppointments,
    },
  }
})
