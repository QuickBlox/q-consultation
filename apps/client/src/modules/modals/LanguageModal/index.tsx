import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import localeOptions from '@qc/template/locales'

import CloseSvg from '@qc/icons/navigation/close.svg'
import Button from '../../../components/Button'
import useComponent from './useComponent'
import './styles.css'

export default function LanguageModal() {
  const {
    store: { opened },
    refs: { backdrop },
    data: { language, isOffline },
    handlers: { onBackdropClick, handleClose, handleApply, setLanguage },
  } = useComponent()
  const { t } = useTranslation()

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
