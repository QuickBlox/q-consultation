import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Tabs from '../../components/Tabs'
import FlatList from '../../components/FlatList'
import AppointmentListItem from './ListItem'
import useComponent, { AppointmentsProps } from './useComponent'
import './styles.css'
import { SearchSvg } from '../../icons'

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
    data: { isOffline, search, appointmentsList },
    store: {
      callAppointmentId,
      callDuration,
      dialogs,
      users,
      usersLoading,
      appointmentLoading,
    },
    handlers: {
      onRemoveClick,
      handleSelect,
      handleChangeSearch,
    },
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
          <div className="appointment-search">
            <SearchSvg className="icon" />
            <input
              onChange={handleChangeSearch}
              placeholder={t('Search')}
              type="search"
              value={search}
            />
          </div>
          <div className="appointments">
            <FlatList
              data={appointmentsList}
              refreshing={appointmentLoading}
              renderItem={renderListItem}
            />
          </div>
        </Tabs.Tab>
      </Tabs>
    </aside>
  )
}
