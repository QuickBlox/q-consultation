import { useTranslation } from 'react-i18next'

import CardAppointment from '../../components/CardAppointment'
import FlatList from '../../components/FlatList'
import useComponent, { ChatHistoryTabProps } from './useComponent'
import './styles.css'

export default function ChatHistoryTab(props: ChatHistoryTabProps) {
  const {
    store: { appointmentLoading, appointmentList, userEntries },
    handlers: { handleOpenAppointmentChatModal, loadMoreAppointments },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderAppointments = (appointment: QBAppointment) => (
    <CardAppointment
      key={appointment._id}
      appointment={appointment}
      user={userEntries[appointment.client_id]}
      onClick={() => handleOpenAppointmentChatModal(appointment._id)}
    />
  )

  return (
    <FlatList
      className="chat-history-tab"
      data={appointmentList}
      onEndReached={loadMoreAppointments}
      onEndReachedThreshold={0.8}
      refreshing={appointmentLoading}
      renderItem={renderAppointments}
      ListEmptyComponent={() => (
        <div className="chat-history-empty">{t('NoData')}</div>
      )}
    />
  )
}
