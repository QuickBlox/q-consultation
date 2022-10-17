import cn from 'classnames'

import { BackSvg, CloseSvg } from '../../../icons'
import Avatar from '../../../components/Avatar'
import './styles.css'
import useComponent, { ProviderBiographyModalProps } from './useComponent'

export default function ProviderBiographyModal(
  props: ProviderBiographyModalProps,
) {
  const {
    store: { opened },
    data: { userName, currentUser, RESOLUTION_XS },
    refs: { backdrop },
    handlers: { onBackdropClick, onCancelClick },
  } = useComponent(props)

  return (
    <div
      className={cn('modal provider-biography-modal', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="container">
        <div className="header-card">
          {RESOLUTION_XS && (
            <div className="header-nav">
              <button className="back" type="button" onClick={onCancelClick}>
                <BackSvg className="icon" />
              </button>
            </div>
          )}
          <div className="header-info">
            <div className="user-info">
              <Avatar
                className="avatar"
                url={
                  currentUser?.custom_data?.avatar?.uid &&
                  QB.content.privateUrl(currentUser.custom_data.avatar.uid)
                }
              />
              <span className="user-name">{userName}</span>
            </div>
          </div>
        </div>
        <div className="main-card">
          <div className="provider-info">
            {currentUser?.custom_data.description}
          </div>
        </div>
      </div>
    </div>
  )
}
