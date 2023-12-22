import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { QBAppointment } from '@qc/quickblox'

import {
  getAppointments,
  getRecords,
  listUsers,
  sendSystemMessage,
  toggleShowModal,
  updateAppointment,
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
  recorderDataSelector,
  usersEntriesSelector,
  usersLoadingSelector,
} from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import {
  APPOINTMENT_TYPE_ROUTE,
  SELECTED_APPOINTMENT_ROUTE,
} from '../../constants/routes'
import {
  ABOUT_TAB,
  AppointmentTypes,
  ChatTabs,
  QUEUE_TYPE,
} from '../../constants/tabs'

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
  records: recorderDataSelector,
  appointmentActiveList: appointmentActiveListSelector,
  appointmentLoading: appointmentLoadingSelector,
  appointmentSkip: appointmentSkipSelector,
  appointmentEntries: appointmentEntriesSelector,
  appointmentHasMore: appointmentHasMoreSelector,
})

export default createUseComponent((props: AppointmentsProps) => {
  const { isOpenMenu, toggleMenu, selected, onSelect } = props
  const store = useSelector(selector)
  const actions = useActions({
    getAppointments,
    listUsers,
    toggleShowModal,
    getRecords,
    updateAppointment,
    sendSystemMessage,
  })
  const { appointmentId, appointmentType, tab } = useParams<{
    appointmentType: AppointmentTypes
    appointmentId: QBAppointment['_id']
    tab: ChatTabs
  }>()
  const {
    connected,
    appointmentActiveList,
    providerId,
    ready,
    users,
    appointmentLoading,
    appointmentSkip,
    appointmentEntries,
    appointmentHasMore,
  } = store
  const isOffline = useIsOffLine()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const searchedAppointmentList = search
    ? appointmentActiveList.filter(({ client_id }) => {
        const client = users[client_id]

        return (
          client &&
          client.full_name &&
          client.full_name.toLowerCase().includes(search.toLowerCase())
        )
      })
    : appointmentActiveList

  const [firstAppointment] = searchedAppointmentList

  const handleChangeSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setSearch(value)

  const activateAppointment = (appointment: QBAppointment) => {
    if (!appointmentId || appointmentId !== appointment._id) {
      const path = generatePath(SELECTED_APPOINTMENT_ROUTE, {
        appointmentType: appointmentType || QUEUE_TYPE,
        appointmentId: appointment._id,
        tab: tab || ABOUT_TAB,
      })

      navigate(path)
    }
  }

  const handleSelect = (appointment: QBAppointment) => {
    if (isOpenMenu) toggleMenu()

    activateAppointment(appointment)

    if (!selected || selected !== appointment._id) {
      onSelect(appointment._id)
    }
  }

  const onRemoveClick = (item: QBAppointment) => {
    if (isOpenMenu) toggleMenu()
    actions.toggleShowModal({
      modal: 'AppointmentActionModal',
      appointmentId: item._id,
    })
  }

  const handleChangeTab = (newTab: AppointmentTypes) => {
    if (newTab !== appointmentType) {
      const path = generatePath(APPOINTMENT_TYPE_ROUTE, {
        appointmentType: newTab,
      })

      navigate(path)
    }
  }

  const handleGetAppointments = (skip = 0) => {
    if (!isOffline) {
      actions.getAppointments({
        filters: {
          date_end: null,
          provider_id: providerId,
          limit: PER_PAGE,
          skip,
        },
        reset: skip ? undefined : 'liveQueue',
      })
    }
  }

  const loadMoreAppointments = () => {
    if (appointmentLoading || !appointmentHasMore) return
    handleGetAppointments(appointmentSkip + PER_PAGE)
  }

  useEffect(() => {
    if (selected && !isOffline) {
      actions.getRecords(selected)
    }
  }, [selected, isOffline])

  useEffect(() => {
    const isActiveFirstAppointment = appointmentId
      ? firstAppointment?._id &&
        (!appointmentEntries[appointmentId] ||
          appointmentEntries[appointmentId].date_end ||
          appointmentEntries[appointmentId].provider_id !== providerId)
      : firstAppointment?._id

    if (isActiveFirstAppointment) {
      activateAppointment(firstAppointment)
    }
  }, [firstAppointment?._id, appointmentId, appointmentEntries, providerId])

  useEffect(() => {
    if (ready && connected) {
      if (appointmentType === QUEUE_TYPE) {
        handleGetAppointments()
      }
    }
  }, [ready && connected, appointmentType])

  useEffect(() => {
    const handleSiteFocus = () => {
      if (appointmentType === QUEUE_TYPE) {
        handleGetAppointments()
      }
    }

    window.addEventListener('focus', handleSiteFocus)

    return () => {
      window.removeEventListener('focus', handleSiteFocus)
    }
  }, [providerId, appointmentType, appointmentSkip, isOffline])

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
    data: {
      isOffline,
      appointmentId,
      appointmentType,
      search,
      searchedAppointmentList,
    },
    handlers: {
      onRemoveClick,
      handleSelect,
      handleChangeTab,
      handleChangeSearch,
      loadMoreAppointments,
    },
  }
})
