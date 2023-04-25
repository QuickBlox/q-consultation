import { useTranslation } from 'react-i18next'

import { BackSvg } from '../../icons'
import Button from '../../components/Button'
import Avatar from '../../components/Avatar'
import useComponent, { ProviderDetailsProps } from './useComponent'
import './styles.css'
import Skeleton from '../../components/Skeleton'

export default function ProviderDetails(props: ProviderDetailsProps) {
  const { onBack } = props
  const {
    refs: { refBiography },
    store: { user, usersLoading },
    data: { userData, dialogName, loading },
    handlers: { handleWaitingRoomClick, createHandleClickSeeMore },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div className="provider-details">
      <div className="provider-header">
        <button className="back" type="button" onClick={onBack}>
          <BackSvg className="icon" />
        </button>
        <Avatar
          url={
            userData.avatar?.uid && QB.content.privateUrl(userData.avatar.uid)
          }
          className="provider-avatar"
        />
        {!user && usersLoading ? (
          <Skeleton className="provider-name-skeleton" />
        ) : (
          <span className="provider-name">{dialogName}</span>
        )}
      </div>
      <div className="provider-content">
        {user || usersLoading ? (
          <pre className="provider-description" ref={refBiography}>
            {userData?.description}
          </pre>
        ) : (
          <div className='provider-select'>{t('YouNeedSelectAgent')}</div>
        )}
        {refBiography.current?.clientHeight === 198 && (
          <div className="biography-controls">
            <button
              type="button"
              className="biography-more"
              onClick={createHandleClickSeeMore(user?.id)}
            >
              {t('SeeMore')}
            </button>
          </div>
        )}
        <div className="btn-group">
          <Button
            mobileSize="auto"
            theme="primary"
            disabled={!user}
            loading={loading}
            onClick={handleWaitingRoomClick}
            className="btn"
          >
            {t('WaitingRoom')}
          </Button>
        </div>
      </div>
    </div>
  )
}
