import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import CloseSvg from '@qc/icons/navigation/close.svg'
import useComponent, { SaveRecordModalProps } from './useComponent'
import Button from '../../../components/Button'
import FormField from '../../../components/FormField'
import { InputField } from '../../../components/Field'

export default function SaveRecordModal(props: SaveRecordModalProps) {
  const {
    refs: { backdrop },
    store: { opened },
    forms: { fileForm },
    handlers: { onBackdropClick, handleCancel },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal save-record', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={handleCancel} />
      <form className="form" onSubmit={fileForm.handleSubmit}>
        <div className="title">{t('DownloadConsultationRecording')}</div>
        <div className="body">
          <div className="label">
            {t('VideoRecordingNotBeSaved', { name: APP_NAME })}
          </div>
          <FormField
            htmlFor="filename"
            label={t('RecordingName')}
            error={fileForm.touched.filename && fileForm.errors.filename}
          >
            <InputField
              id="filename"
              name="filename"
              type="text"
              placeholder={t('EnterRecordName')}
              onChange={fileForm.handleChange}
              onBlur={fileForm.handleBlur}
              value={fileForm.values.filename}
            />
          </FormField>

          <div className="btn-group">
            <Button
              mobileSize="sm"
              type="submit"
              className="btn"
              disabled={!fileForm.values.filename}
              theme="primary"
            >
              {t('Download')}
            </Button>
            <Button mobileSize="sm" className="btn" onClick={handleCancel}>
              {t('Cancel')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
