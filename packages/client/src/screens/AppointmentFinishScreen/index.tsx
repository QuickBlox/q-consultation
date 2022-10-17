import { useTranslation } from 'react-i18next'

import Button from '../../components/Button'
import FormField from '../../components/FormField'
import { TextAreaField } from '../../components/Field'
import useComponent from './useComponent'
import './styles.css'

export default function AppointmentFinishScreen() {
  const {
    store: { currentAppointment, myAccount },
    data: { isOffline, isSignOut },
    handlers: { handleRegisterClick },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <div className="appointment-finish-wrapper">
      <h2 className="appointment-finish-title">
        {t('ConsultationOver', {
          name: myAccount?.full_name,
        })}
      </h2>
      <div className="appointment-finish">
        <span className="register-title">{t('PleaseRegister')}</span>
        <div className="btn-group">
          <Button
            className="btn"
            theme="primary"
            loading={isSignOut || isOffline}
            onClick={handleRegisterClick}
          >
            {t('Register')}
          </Button>
        </div>
      </div>
      <div className="appointment-finish-description">
        <FormField htmlFor="conclusion" label={t('ConsultationTopic')}>
          <TextAreaField
            readOnly
            id="conclusion"
            name="conclusion"
            value={currentAppointment?.description}
            rows={6}
          />
        </FormField>
      </div>
    </div>
  )
}
