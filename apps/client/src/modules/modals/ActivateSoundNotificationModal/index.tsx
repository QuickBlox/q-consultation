import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Button from '../../../components/Button'
import { CloseSvg } from '../../../icons'
import useComponent, {
  ActivateSoundNotificationModalProps,
} from './useComponent'
import './styles.css'

export default function ActivateSoundNotificationModal(
  props: ActivateSoundNotificationModalProps,
) {
  const { open, onClose } = props
  const {
    refs: { backdrop },
    handlers: { handleBackdropClick },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal browser-compatibility', { active: open })}
      onClick={handleBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onClose} />
      <div className="form">
        <div className="body">
          <div className="title">
            {t('ActivateSoundNotification', { name: 'Q-Consultation' })}
          </div>
          <div className="btn-group">
            <Button mobileSize="sm" className="btn" onClick={onClose}>
              {t('Ok')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
