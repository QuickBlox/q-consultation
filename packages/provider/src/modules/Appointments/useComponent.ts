import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import {
  createDialog,
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
import { QBDialogCreateSuccessAction } from '../../actions'
import { createMapStateSelector } from '../../utils/selectors'
import { DIALOG_NOTIFICATION } from '../../constants/notificationTypes'
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
  records: recorderDataSelector,
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
    updateAppointment,
    sendSystemMessage,
  })
  const isOffline = useIsOffLine()

  const {
    connected,
    appointmentActiveList,
    providerId,
    ready,
    users,
    records,
    appointmentLoading,
    appointmentHasMore,
    appointmentSkip,
    appointmentEntries,
  } = store

  const handleSelect = (item: QBAppointment) => {
    if (isOpenMenu) toggleMenu()

    if (!selected || selected !== item._id) {
      onSelect(item._id)

      if (!item.dialog_id) {
        actions.createDialog({
          userIds: item.client_id,
          then: (action: QBDialogCreateSuccessAction) => {
            actions.updateAppointment({
              _id: item._id,
              data: { dialog_id: action.payload._id },
              then: () => {
                actions.sendSystemMessage({
                  dialogId: QB.chat.helpers.getUserJid(item.client_id),
                  message: {
                    extension: {
                      notification_type: DIALOG_NOTIFICATION,
                      dialog_id: action.payload._id,
                    },
                  },
                })
              },
            })
          },
        })
      }
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

  const loadMoreAppointments = () => {
    if (appointmentLoading || !appointmentHasMore) return
    handleGetAppointments(appointmentSkip + PER_PAGE)
  }

  useEffect(() => {
    if (selected && appointmentActiveList && !isOffline) {
      const selectedAppointment = appointmentEntries[selected]
      const missingRecordsIds = selectedAppointment?.records?.filter(
        (fileId) => !records[fileId],
      )

      if (missingRecordsIds?.length) {
        actions.getRecords(missingRecordsIds)
      }
    }
  }, [selected, appointmentActiveList, isOffline])

  useEffect(() => {
    if (ready && connected) {
      handleGetAppointments()
    }
  }, [ready && connected])

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
    data: { isOffline },
    handlers: {
      onRemoveClick,
      handleSelect,
      loadMoreAppointments,
    },
  }
})
