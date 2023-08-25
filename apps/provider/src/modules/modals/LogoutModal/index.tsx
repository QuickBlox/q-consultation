import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Button from '../../../components/Button'
import { CloseSvg } from '../../../icons'
import useComponent, { LogoutModalProps } from './useComponent'

export default function LogoutModal(props: LogoutModalProps) {
  const {
    store: { opened, loading, onCall },
    refs: { backdrop },
    data: { isSignOut },
    handlers: { onBackdropClick, onCancelClick, handleSignOut },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal logout', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="title">{t('SignOut')}</div>
        <div className="body">
          <span className="label">
            {onCall || isSignOut
              ? t('WantEndCallAndSignOut')
              : t('WantSignOut')}
          </span>
          <div className="btn-group">
            <Button
              mobileSize="sm"
              className="btn"
              loading={isSignOut || loading}
              onClick={handleSignOut}
              theme="primary"
            >
              {t('SignOut')}
            </Button>
            <Button
              mobileSize="sm"
              className="btn"
              disabled={isSignOut}
              onClick={onCancelClick}
            >
              {t('Cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
