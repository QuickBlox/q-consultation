import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Button from '../../../components/Button'
import { CloseSvg } from '../../../icons'
import useComponent, { ShareLinkModalProps } from './useComponent'
import './styles.css'
import { InputField } from '../../../components/Field'

export default function ShareLinkModal(props: ShareLinkModalProps) {
  const {
    store: { opened },
    refs: { backdrop },
    data: { copied, url },
    handlers: { onCopyButtonClick, onCancelClick, onBackdropClick },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal share-link', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="title">{t('ShareLink')}</div>
        <div className="body">
          <InputField
            autoComplete="name"
            disabled
            id="full_name"
            name="full_name"
            type="text"
            value={url}
          />
          <Button
            size="xl"
            theme="primary"
            className="btn copy-btn"
            onClick={onCopyButtonClick}
          >
            {t('CopyLink')}
          </Button>
          <span className={cn('copied', { active: copied })}>
            {t('Copied')}
          </span>
        </div>
      </div>
    </div>
  )
}
