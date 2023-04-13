import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import UserSelect from '../../UserSelect'
import Button from '../../../components/Button'
import { CloseSvg } from '../../../icons'
import { TextAreaField } from '../../../components/Field'
import FormField from '../../../components/FormField'
import useComponent, { CreateAppointmentModalProps } from './useComponent'

export default function CreateAppointmentModal(props: CreateAppointmentModalProps) {
  const {
    data: { error, loading },
    store: { opened },
    forms: { appointmentForm },
    refs: { backdrop },
    handlers: {
      onBackdropClick,
      onCancelClick,
      handleSelectClient,
      filterClients,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal create-appointment', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <form className="form" onSubmit={appointmentForm.handleSubmit}>
        <div className="title">{t('CreateAppointment')}</div>
        <div className="body">
          <FormField
            htmlFor="client_id"
            label={t('Client')}
            error={
              appointmentForm.touched.client_id &&
              appointmentForm.errors.client_id &&
              t(appointmentForm.errors.client_id)
            }
          >
            <UserSelect
              inputId="client_id"
              filter={filterClients}
              value={appointmentForm.values.client_id}
              onChange={handleSelectClient}
            />
          </FormField>
          <FormField
            htmlFor="description"
            label={t('AppointmentPurpose')}
            error={
              appointmentForm.touched.description &&
              appointmentForm.errors.description &&
              t(appointmentForm.errors.description)
            }
          >
            <TextAreaField
              id="description"
              name="description"
              onChange={appointmentForm.handleChange}
              value={appointmentForm.values.description}
              rows={6}
            />
          </FormField>
          <div className="btn-group">
            <Button
              size="xl"
              className="btn"
              loading={loading}
              theme="primary"
              type="submit"
            >
              {t('Create')}
            </Button>
          </div>
          {error && (
              <div className="error-form">
                {error && t(error)}
              </div>
            )}
        </div>
      </form>
    </div>
  )
}
