import { useTranslation } from 'react-i18next'

import Button from '../../components/Button'
import FormField from '../../components/FormField'
import { TextAreaField } from '../../components/Field'
import useComponent, { ConclusionProps } from './useComponent'
import './styles.css'

export default function Conclusion(props: ConclusionProps) {
  const {
    store: { currentAppointment, myAccount },
    data: { loadingConclusion, isOffline },
    handlers: { onDownloadConclusion, goToMainScreen },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div className="conclusion-wrapper">
      <h2 className="conclusion-title">
        {t('ConsultationOver', {
          name: myAccount?.full_name,
        })}
      </h2>
      <div className="conclusion">
        <span className="ready">{t('ConclusionReady')}</span>
        <div className="btn-group">
          <Button
            className="btn"
            theme="primary"
            disabled={isOffline}
            onClick={onDownloadConclusion}
            loading={loadingConclusion}
          >
            {t('Download')}
          </Button>
          <Button
            className="btn"
            onClick={goToMainScreen}
            loading={loadingConclusion}
          >
            {t('BackToMainScreen')}
          </Button>
        </div>
      </div>
      <div className="conclusion-description">
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
