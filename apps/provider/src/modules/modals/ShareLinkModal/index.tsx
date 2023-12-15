import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import CloseSvg from '@qc/icons/navigation/close.svg'
import Button from '../../../components/Button'
import { InputField } from '../../../components/Field'
import useComponent, { ShareLinkModalProps } from './useComponent'
import './styles.css'

export default function ShareLinkModal(props: ShareLinkModalProps) {
  const {
    store: { opened },
    refs: { backdrop },
    data: { url },
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
        </div>
      </div>
    </div>
  )
}
