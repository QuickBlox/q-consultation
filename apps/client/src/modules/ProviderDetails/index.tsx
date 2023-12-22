import { useTranslation } from 'react-i18next'

import BackSvg from '@qc/icons/navigation/arrow-left.svg'
import Button from '../../components/Button'
import Avatar from '../../components/Avatar'
import useComponent, { ProviderDetailsProps } from './useComponent'
import Skeleton from '../../components/Skeleton'
import './styles.css'

export default function ProviderDetails(props: ProviderDetailsProps) {
  const { onBack } = props
  const {
    refs: { refBiography },
    store: { user, usersLoading },
    data: { userData, dialogName, loading, userAvatar },
    handlers: { handleWaitingRoomClick, createHandleClickSeeMore },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div className="provider-details">
      <div className="provider-header">
        {HAS_PROVIDER_LIST && (
          <button className="back" type="button" onClick={onBack}>
            <BackSvg className="icon" />
          </button>
        )}
        {!userAvatar || userAvatar.loading ? (
          <Skeleton variant="circular" className="provider-avatar" />
        ) : (
          <Avatar blob={userAvatar.blob} className="provider-avatar" />
        )}
        {!user && usersLoading ? (
          <Skeleton className="provider-name-skeleton" />
        ) : (
          <span className="provider-name">{dialogName}</span>
        )}
      </div>
      <div className="provider-content">
        <pre className="provider-description" ref={refBiography}>
          {userData?.description}
        </pre>
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
