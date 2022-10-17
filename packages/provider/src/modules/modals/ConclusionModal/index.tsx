import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { SelectField, TextAreaField } from '../../../components/Field'
import FormField from '../../../components/FormField'
import Button from '../../../components/Button'
import { CloseSvg } from '../../../icons'
import useComponent, { ConclusionModalProps } from './useComponent'
import localeOptions from '../../../constants/localeOptions'

export default function ConclusionModal(props: ConclusionModalProps) {
  const {
    forms: { conclusionForm },
    store: { opened, appointment, appointmentLoading },
    refs: { backdrop },
    data: { userName },
    handlers: { onCancelClick, onBackdropClick, skipAppointment },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal conclusion', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <form className="form" onSubmit={conclusionForm.handleSubmit}>
        <div className="title">{t('SummaryFor', { name: userName })}</div>
        <div className="body">
          <FormField
            htmlFor="language"
            label={t('Language')}
            hint={t('LanguageHint')}
            error={
              conclusionForm.touched.language &&
              conclusionForm.errors.language &&
              t(conclusionForm.errors.language)
            }
          >
            <SelectField
              disabled={appointmentLoading}
              id="language"
              name="language"
              onChange={(value) =>
                conclusionForm.setFieldValue('language', value)
              }
              onBlur={conclusionForm.handleBlur}
              value={conclusionForm.values.language}
              options={localeOptions}
            />
          </FormField>
          <FormField
            htmlFor="conclusion"
            label={t('AppointmentSummary')}
            error={
              conclusionForm.touched.conclusion &&
              conclusionForm.errors.conclusion &&
              t(conclusionForm.errors.conclusion)
            }
          >
            <TextAreaField
              id="conclusion"
              name="conclusion"
              disabled={appointmentLoading}
              onChange={conclusionForm.handleChange}
              onBlur={conclusionForm.handleBlur}
              value={conclusionForm.values.conclusion}
              rows={9}
              maxLength={3000}
            />
          </FormField>
          <div className="btn-group">
            <Button
              mobileSize="sm"
              type="submit"
              className="btn"
              disabled={!appointment}
              theme="primary"
            >
              {t('Send')}
            </Button>
            <Button
              mobileSize="sm"
              className="btn"
              loading={appointmentLoading}
              onClick={skipAppointment}
            >
              {t('Skip')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
