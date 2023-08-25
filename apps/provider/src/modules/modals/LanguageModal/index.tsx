import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Button from '../../../components/Button'
import { CloseSvg } from '../../../icons'
import localeOptions from '../../../constants/localeOptions'
import useComponent from './useComponent'
import './styles.css'

export default function LanguageModal() {
  const { t } = useTranslation()
  const {
    store: { opened },
    refs: { backdrop },
    data: { language, isOffline },
    handlers: { onBackdropClick, handleClose, handleApply, setLanguage },
  } = useComponent()

  return (
    <div
      className={cn('modal language-modal', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={handleClose} />
      <div className="form">
        <div className="title">{t('ChooseLanguage')}</div>
        <div className="body">
          <ul className="list-lang">
            {localeOptions.map(({ value, label }) => (
              <li
                key={value}
                className={cn('list-lang-item', {
                  active: language.includes(value),
                })}
                onClick={() => setLanguage(value)}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer btn-group">
          <Button
            mobileSize="sm"
            className="btn"
            onClick={handleApply}
            theme="primary"
            disabled={isOffline}
          >
            {t('Apply')}
          </Button>
          <Button mobileSize="sm" className="btn" onClick={handleClose}>
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </div>
  )
}
