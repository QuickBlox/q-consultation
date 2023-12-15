import { useTranslation } from 'react-i18next'
import { QBAppointment } from '@qc/quickblox/dist/types'

import BackSvg from '@qc/icons/navigation/arrow-left.svg'
import { DateInputField } from '../../components/Field'
import CardAppointment from '../../components/CardAppointment'
import FormField from '../../components/FormField'
import FlatList from '../../components/FlatList'
import useComponent, { AppointmentRegisterProps } from './useComponent'
import './styles.css'

function NoData() {
  const { t } = useTranslation()

  return <div className="register-empty">{t('NoData')}</div>
}

export default function AppointmentRegister(props: AppointmentRegisterProps) {
  const {
    fromDate,
    toDate,
    loading,
    appointmentList,
    loadMoreAppointments,
    title,
    onBack,
    onSelectAppointment,
  } = props
  const {
    forms: { dateFilterForm },
    data: { disabledDays },
    store: { userEntries, usersLoading, avatarEntries },
    handlers: { handleChangeDate },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderListItem = (appointment: QBAppointment) => (
    <CardAppointment
      showUserInfo
      loading={loading || usersLoading}
      key={appointment._id}
      appointment={appointment}
      user={userEntries[appointment.provider_id]}
      avatar={avatarEntries[appointment.provider_id]}
      onClick={() => onSelectAppointment(appointment._id)}
      className="register-card"
    />
  )

  return (
    <div className="appointment-register">
      <div className="register-header">
        <div className="register-header-nav">
          <button className="back" type="button" onClick={onBack}>
            <BackSvg className="icon" />
          </button>
          <span className="title">{title}</span>
        </div>
        <div className="date-filter">
          <div className="date-filter-field">
            <FormField
              inline
              htmlFor="from"
              label={t('From')}
              error={
                dateFilterForm.touched.from &&
                dateFilterForm.errors.from &&
                t(dateFilterForm.errors.from)
              }
            >
              <DateInputField
                small
                className="date-filter-input"
                value={dateFilterForm.values.from}
                onDayChange={handleChangeDate('from')}
                inputProps={{
                  id: 'from',
                  name: 'from',
                  onBlur: dateFilterForm.handleBlur,
                }}
                disabled={
                  toDate ? [disabledDays, { after: toDate }] : disabledDays
                }
              />
            </FormField>
          </div>
          <div className="date-filter-field">
            <FormField
              inline
              htmlFor="to"
              label={t('To')}
              error={
                dateFilterForm.touched.to &&
                dateFilterForm.errors.to &&
                t(dateFilterForm.errors.to)
              }
            >
              <DateInputField
                small
                className="date-filter-input"
                onDayChange={handleChangeDate('to')}
                value={dateFilterForm.values.to}
                inputProps={{
                  id: 'to',
                  name: 'to',
                  onBlur: dateFilterForm.handleBlur,
                }}
                disabled={
                  fromDate ? [disabledDays, { before: fromDate }] : disabledDays
                }
              />
            </FormField>
          </div>
          {dateFilterForm.touched.from &&
            dateFilterForm.touched.to &&
            dateFilterForm.errors.common && (
              <div className="error-form">
                {t(dateFilterForm.errors.common)}
              </div>
            )}
        </div>
      </div>
      <FlatList
        className="register-content"
        data={appointmentList}
        onEndReached={loadMoreAppointments}
        onEndReachedThreshold={0.8}
        refreshing={loading}
        renderItem={renderListItem}
        ListEmptyComponent={NoData}
      />
    </div>
  )
}
