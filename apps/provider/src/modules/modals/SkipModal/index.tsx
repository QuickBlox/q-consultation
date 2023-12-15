import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import CloseSvg from '@qc/icons/navigation/close.svg'
import Button from '../../../components/Button'
import useComponent, { SkipModalProps } from './useComponent'

export default function SkipModal(props: SkipModalProps) {
  const {
    store: { opened, loading, appointment },
    refs: { backdrop },
    data: { userName },
    handlers: { skipAppointment, onBackdropClick, onCancelClick },
  } = useComponent(props)

  const { t } = useTranslation()

  return (
    <div
      className={cn('modal skip', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="title">
          {t('RemoveNameFromQueue', { name: userName })}
        </div>
        <div className="body">
          <span className="label">{t('WantRemoveClient')}</span>
          <div className="btn-group">
            <Button
              mobileSize="sm"
              className="btn"
              loading={loading}
              disabled={!appointment}
              onClick={skipAppointment}
              theme="primary"
            >
              {t('Remove')}
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
