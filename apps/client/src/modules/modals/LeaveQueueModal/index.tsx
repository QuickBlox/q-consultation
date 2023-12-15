import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import CloseSvg from '@qc/icons/navigation/close.svg'
import Button from '../../../components/Button'
import useComponent, { LeaveQueueModalProps } from './useComponent'

export default function LeaveQueueModal(props: LeaveQueueModalProps) {
  const {
    data: { isOffline },
    store: { loading, opened },
    refs: { backdrop },
    handlers: { handleBackdropClick, handleLeaveQueue, onCancelClick },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal leave-queue', { active: opened })}
      onClick={handleBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="body">
          <span className="label">{t('WantLeaveQueue')}</span>
          <div className="btn-group">
            <Button
              mobileSize="sm"
              className="btn"
              loading={loading}
              disabled={isOffline}
              onClick={handleLeaveQueue}
              theme="primary"
            >
              {t('Leave')}
            </Button>
            <Button mobileSize="sm" className="btn" onClick={onCancelClick}>
              {t('Stay')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
