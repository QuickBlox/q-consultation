import { useTranslation } from 'react-i18next'
import AppointmentRegister from '../../modules/AppointmentRegister'
import useComponent from './useComponent'

export default function HistoryScreen() {
  const {
    store: { appointmentList, appointmentLoading },
    data: { dateRange },
    handlers: {
      onBack,
      handleChangeDate,
      handleSelectAppointment,
      loadMoreAppointments,
    },
  } = useComponent(undefined)

  const { t } = useTranslation()

  return (
    <AppointmentRegister
      type="history"
      title={t('History')}
      fromDate={dateRange.from}
      toDate={dateRange.to}
      loading={appointmentLoading}
      appointmentList={appointmentList}
      loadMoreAppointments={loadMoreAppointments}
      onChangeDate={handleChangeDate}
      onSelectAppointment={handleSelectAppointment}
      onBack={onBack}
    />
  )
}
