import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  createDialog,
  getAppointments,
  getRecords,
  listUsers,
  sendSystemMessage,
  toggleShowModal,
} from '../../actionCreators'
import {
  appointmentActiveListSelector,
  appointmentEntriesSelector,
  appointmentHasMoreSelector,
  appointmentLoadingSelector,
  appointmentSkipSelector,
  authMyAccountIdSelector,
  callAppointmentIdSelector,
  callDurationSelector,
  chatConnectedSelector,
  dialogsEntriesSelector,
  qbReadySelector,
  usersEntriesSelector,
  usersLoadingSelector,
} from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

const PER_PAGE = 30

export interface AppointmentsProps {
  isOpenMenu: boolean
  toggleMenu: VoidFunction
  selected?: QBAppointment['_id']
  onSelect: (value?: QBAppointment['_id']) => void
}

const selector = createMapStateSelector({
  connected: chatConnectedSelector,
  callAppointmentId: callAppointmentIdSelector,
  callDuration: callDurationSelector,
  dialogs: dialogsEntriesSelector,
  providerId: authMyAccountIdSelector,
  ready: qbReadySelector,
  users: usersEntriesSelector,
  usersLoading: usersLoadingSelector,
  appointmentActiveList: appointmentActiveListSelector,
  appointmentLoading: appointmentLoadingSelector,
  appointmentHasMore: appointmentHasMoreSelector,
  appointmentSkip: appointmentSkipSelector,
  appointmentEntries: appointmentEntriesSelector,
})

export default createUseComponent((props: AppointmentsProps) => {
  const { isOpenMenu, toggleMenu, selected, onSelect } = props
  const store = useSelector(selector)
  const actions = useActions({
    createDialog,
    getAppointments,
    listUsers,
    toggleShowModal,
    getRecords,
    sendSystemMessage,
  })
  const isOffline = useIsOffLine()
  const [search, setSearch] = useState('')

  const handleChangeSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setSearch(value)

  const {
    connected,
    providerId,
    ready,
    users,
    appointmentLoading,
    appointmentHasMore,
    appointmentSkip,
    appointmentEntries,
    appointmentActiveList,
  } = store

  const appointmentsList = search
    ? appointmentActiveList.filter(({ client_id }) =>
        users[client_id]?.full_name
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : appointmentActiveList

  const handleSelect = (item: QBAppointment) => {
    if (isOpenMenu) toggleMenu()

    if (!selected || selected !== item._id) {
      onSelect(item._id)
    }
  }

  const onRemoveClick = (item: QBAppointment) => {
    if (isOpenMenu) toggleMenu()
    actions.toggleShowModal({
      modal: 'AppointmentActionModal',
      appointmentId: item._id,
    })
  }

  const handleGetAppointments = (skip = 0) => {
    if (!isOffline) {
      actions.getAppointments({
        filters: {
          date_start: null,
          date_end: null,
          provider_id: providerId,
          limit: PER_PAGE,
          skip,
        },
        reset: skip ? undefined : 'liveQueue',
      })
    }
  }

  useEffect(() => {
    if (selected && !isOffline) {
      actions.getRecords(selected)
    }
  }, [selected, isOffline])

  useEffect(() => {
    if (ready && connected) {
      handleGetAppointments()
    }
  }, [ready && connected])

  useEffect(() => {
    if (!appointmentLoading && appointmentHasMore) {
      handleGetAppointments(appointmentSkip + PER_PAGE)
    }
  }, [appointmentLoading, appointmentHasMore, appointmentSkip])

  useEffect(() => {
    const handleSiteFocus = () => {
      handleGetAppointments(appointmentSkip)
    }

    window.addEventListener('focus', handleSiteFocus)

    return () => {
      window.removeEventListener('focus', handleSiteFocus)
    }
  }, [providerId, appointmentSkip, isOffline])

  useEffect(() => {
    if (ready && !isOffline) {
      const userIds = Object.values(appointmentEntries).map((a) => a.client_id)
      const missingUsersIds = userIds.filter((userId) => !users[userId])

      if (missingUsersIds.length) {
        actions.listUsers({
          filter: {
            field: 'id',
            param: 'in',
            value: missingUsersIds,
          },
          per_page: missingUsersIds.length,
        })
      }
    }
  }, [ready, appointmentEntries, isOffline])

  return {
    store,
    actions,
    data: { isOffline, search, appointmentsList },
    handlers: {
      onRemoveClick,
      handleSelect,
      handleChangeSearch,
    },
  }
})
