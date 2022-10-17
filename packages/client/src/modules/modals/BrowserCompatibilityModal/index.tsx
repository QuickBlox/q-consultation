import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Button from '../../../components/Button'
import { CloseSvg } from '../../../icons'
import useComponent, { compatibleBrowsers } from './useComponent'
import './styles.css'

export default function BrowserCompatibilityModal() {
  const {
    refs: { backdrop },
    data: { deviceInfo, open },
    handlers: { handleBackdropClick, handleClose },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal browser-compatibility', { active: open })}
      onClick={handleBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={handleClose} />
      <div className="form">
        <div className="body">
          <div className="title">
            {t('BrowserNotCompatible', { name: 'Q-Consultation' })}
          </div>
          {typeof deviceInfo.os.name === 'string' &&
            compatibleBrowsers[deviceInfo.os.name] && (
              <span className="label">
                {t('CompatibleBrowsers', {
                  browsers: compatibleBrowsers[deviceInfo.os.name].join(', '),
                })}
              </span>
            )}
          <div className="btn-group">
            <Button mobileSize="sm" className="btn" onClick={handleClose}>
              {t('Ok')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
