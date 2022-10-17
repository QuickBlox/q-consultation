import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Tabs from '../../components/Tabs'
import FlatList from '../../components/FlatList'
import AppointmentListItem from './ListItem'
import useComponent, { AppointmentsProps } from './useComponent'
import './styles.css'

function hasUnreadMessage(
  appointment: QBAppointment,
  dialogs: Dictionary<QBChatDialog>,
) {
  const dialog = dialogs[appointment.dialog_id]

  return dialog
    ? typeof dialog.unread_messages_count === 'number' &&
        dialog.unread_messages_count > 0
    : false
}

export default function Appointments(props: AppointmentsProps) {
  const { isOpenMenu, selected } = props
  const {
    data: { isOffline },
    store: {
      callAppointmentId,
      callDuration,
      dialogs,
      users,
      usersLoading,
      appointmentActiveList,
      appointmentLoading,
    },
    handlers: { onRemoveClick, handleSelect, loadMoreAppointments },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderListItem = (item: QBAppointment, index: number) => {
    const isCall = item._id === callAppointmentId

    return (
      <AppointmentListItem
        appointment={item}
        callDuration={callDuration}
        hasUnreadMessage={hasUnreadMessage(item, dialogs)}
        index={index}
        key={item._id}
        onCall={isCall}
        onItemClick={handleSelect}
        onRemoveClick={onRemoveClick}
        selected={selected}
        users={users}
        loading={usersLoading}
        disabled={isOffline}
      />
    )
  }

  return (
    <aside className={cn('appointments-container', { open: isOpenMenu })}>
      <Tabs value="queue">
        <Tabs.Tab name="queue" title={t('WaitingRoom')} disabled={isOffline}>
          <FlatList
            data={appointmentActiveList}
            refreshing={appointmentLoading}
            renderItem={renderListItem}
            onEndReachedThreshold={0.8}
            onEndReached={loadMoreAppointments}
          />
        </Tabs.Tab>
      </Tabs>
    </aside>
  )
}
