import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Button from '../../../components/Button'
import useComponent, { CameraModalProps } from './useComponent'
import './styles.css'

export default function CameraModal(props: CameraModalProps) {
  const { open } = props
  const {
    store: { videoInputSources },
    refs: { backdrop },
    data: { selected },
    handlers: { handleApply, handleClose, onBackdropClick, setSelected },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal camera-modal', { active: open })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <div className="form">
        <div className="title">{t('ChooseCamera')}</div>
        <div className="body">
          <ul className="list-devices">
            {videoInputSources.map(({ deviceId, label }, index) => (
              <li
                key={deviceId}
                className={cn('list-devices-item', {
                  active: selected === deviceId,
                })}
                onClick={() => setSelected(deviceId)}
              >
                {label || t('Camera', { index: index + 1 })}
              </li>
            ))}
          </ul>
          <div className="footer btn-group">
            <Button
              mobileSize="sm"
              className="btn"
              onClick={handleApply}
              theme="primary"
            >
              {t('Apply')}
            </Button>
            <Button mobileSize="sm" className="btn" onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
