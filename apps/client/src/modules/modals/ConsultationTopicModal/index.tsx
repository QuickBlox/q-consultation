import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Button from '../../../components/Button'
import { TextAreaField } from '../../../components/Field'
import { CloseSvg, BackSvg } from '../../../icons'
import useComponent, { ConsultationTopicModalProps } from './useComponent'
import './styles.css'

export default function ConsultationTopicModal(
  props: ConsultationTopicModalProps,
) {
  const {
    store: { opened },
    refs: { backdrop },
    data: { loading, description, isOffline },
    handlers: {
      handleBackdropClick,
      handleChangeDescription,
      handleJoinDialog,
      onCancelClick,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal consultation-topic', { active: opened })}
      onClick={handleBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="body">
          <div className="consultation-topic-header">
            <button className="back" type="button" onClick={onCancelClick}>
              <BackSvg className="icon" />
            </button>
            <label htmlFor="consultation_topic" className="form-field-label">
              {t('ConsultationTopic')}
            </label>
          </div>
          <div className="consultation-topic-body">
            <div className="form-field">
              <TextAreaField
                disabled={loading}
                id="consultation_topic"
                name="consultation_topic"
                className="form-field-input"
                onChange={handleChangeDescription}
                value={description}
                rows={8}
              />
            </div>
            <div className="btn-group">
              <Button
                loading={loading}
                disabled={!description || isOffline}
                className="btn btn-join"
                onClick={handleJoinDialog}
                theme="primary"
              >
                {t('StartChat')}
              </Button>
              <Button className="btn" onClick={onCancelClick}>
                {t('Close')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
