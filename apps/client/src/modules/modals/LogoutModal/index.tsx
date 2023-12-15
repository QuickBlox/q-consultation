import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import cn from 'classnames'

import CloseSvg from '@qc/icons/navigation/close.svg'
import Button from '../../../components/Button'
import useComponent, { LogoutModalProps } from './useComponent'
import { PROFILE_ROUTE } from '../../../constants/routes'
import { currentUserIsGuest } from '../../../utils/user'

export default function LogoutModal(props: LogoutModalProps) {
  const {
    store: { opened, loading, onCall, myAccount },
    refs: { backdrop },
    data: { isSignOut },
    handlers: { onBackdropClick, onCancelClick, handleSignOut },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderLabel = () => {
    if (onCall || isSignOut) {
      return t('WantEndCallAndSignOut')
    }

    if (myAccount && currentUserIsGuest(myAccount) && !ENABLE_GUEST_CLIENT) {
      return (
        <Trans
          t={t}
          i18nKey="GuestSignOut"
          components={{
            Link: (
              <Link
                className="link"
                to={PROFILE_ROUTE}
                onClick={onCancelClick}
              />
            ),
          }}
        />
      )
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
