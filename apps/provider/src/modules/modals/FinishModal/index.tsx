import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import CloseSvg from '@qc/icons/navigation/close.svg'
import Button from '../../../components/Button'
import useComponent, { FinishModalProps } from './useComponent'

export default function FinishModal(props: FinishModalProps) {
  const {
    store: { opened, appointmentId },
    refs: { backdrop },
    data: { userName },
    handlers: { onFinishClick, onBackdropClick, onCancelClick },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal finish', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="title">
          {t('FinishConsultationWith', { name: userName })}
        </div>
        <div className="body">
          <span className="label">{t('WantFinishConsultation')}</span>
          <div className="btn-group">
            <Button
              mobileSize="sm"
              className="btn"
              disabled={!appointmentId}
              onClick={onFinishClick}
              theme="primary"
            >
              {t('Finish')}
            </Button>
            <Button mobileSize="sm" className="btn" onClick={onCancelClick}>
              {t('Cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
