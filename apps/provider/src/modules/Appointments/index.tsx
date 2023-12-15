import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { QBAppointment, QBChatDialog } from '@qc/quickblox'

import SearchSvg from '@qc/icons/navigation/search.svg'
import Tabs from '../../components/Tabs'
import FlatList from '../../components/FlatList'
import AppointmentListItem from './ListItem'
import useComponent, { AppointmentsProps } from './useComponent'
import { QUEUE_TYPE } from '../../constants/tabs'
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
  const { isOpenMenu } = props
  const {
    data: {
      isOffline,
      appointmentId,
      appointmentType,
      search,
      searchedAppointmentList,
    },
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
      handleChangeTab,
      handleChangeSearch,
      loadMoreAppointments,
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
        selected={appointmentId}
        users={users}
        loading={usersLoading}
        disabled={isOffline}
      />
    )
  }

  return (
    <aside className={cn('appointments-container', { open: isOpenMenu })}>
      <Tabs value={appointmentType!} onChange={handleChangeTab}>
        <Tabs.Tab name={QUEUE_TYPE} title={t('LiveQueue')} disabled={isOffline}>
          <div className="appointment-search">
            <SearchSvg className="icon" />
            <input
              onChange={handleChangeSearch}
              placeholder={t('Search')}
              type="search"
              value={search}
            />
          </div>
          {searchedAppointmentList.length ? (
            <FlatList
              data={searchedAppointmentList}
              refreshing={appointmentLoading}
              renderItem={renderListItem}
              onEndReachedThreshold={0.8}
              onEndReached={loadMoreAppointments}
            />
          ) : (
            <div className="appointments-empty">
              {t('NoClientYet', {
                list: t('LiveQueue', { context: 'locative' }),
              })}
            </div>
          )}
        </Tabs.Tab>
      </Tabs>
    </aside>
  )
}
