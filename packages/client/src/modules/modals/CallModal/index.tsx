import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import useComponent, { CallModalProps } from './useComponent'
import { CallSvg, EndCallSvg } from '../../../icons'
import Avatar from '../../../components/Avatar'
import './styles.css'

export default function CallModal(props: CallModalProps) {
  const {
    store: { opened },
    data: { userInfo, isOffline },
    handlers: { onAcceptClick, onDeclineClick },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div className={cn('modal call-modal', { active: opened })}>
      <div className="form">
        {userInfo && (
          <div className="info">
            <Avatar
              url={
                userInfo.custom_data?.avatar?.uid &&
                QB.content.privateUrl(userInfo.custom_data.avatar.uid)
              }
              className="avatar"
            />
            <span className="user-name">
              {userInfo.full_name ||
                userInfo.login ||
                userInfo.phone ||
                t('Unknown')}
            </span>
            <span className="calling">{t('Calling')}...</span>
          </div>
        )}
        <div className="btn-group">
          <div className="control-btn-wrapper">
            <button
              className="control-btn accept"
              disabled={isOffline}
              onClick={onAcceptClick}
              type="button"
            >
              <CallSvg className="icon" />
            </button>
            <span>{t('Accept')}</span>
          </div>
          <div className="control-btn-wrapper">
            <button
              className="control-btn decline"
              disabled={isOffline}
              onClick={onDeclineClick}
              type="button"
            >
              <EndCallSvg className="icon" />
            </button>
            <span>{t('Decline')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
