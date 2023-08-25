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

  const renderLabel = () => {
    if (onCall || isSignOut) {
      return t('WantEndCallAndSignOut')
    }

    return t('WantSignOut')
  }

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
          <span className="label">{renderLabel()}</span>
          <div className="btn-group">
            <Button
              mobileSize="sm"
              loading={isSignOut || loading}
              className="btn"
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
