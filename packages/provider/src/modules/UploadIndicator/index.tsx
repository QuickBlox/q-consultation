import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { SkipSvg } from '../../icons'
import useComponent from './useComponent'
import './styles.css'

export interface UploadIndicatorProps {
  type: 'chat' | 'record'
}

export default function UploadIndicator(props: UploadIndicatorProps) {
  const { type } = props
  const {
    store: { progress, uploading, currentType },
    actions: { uploadFileCancel },
  } = useComponent()
  const { t } = useTranslation()

  if (type === 'chat') {
    return (
      <div className="upload-indicator-wrapper">
        <div
          className={cn('upload-indicator', {
            [`${type} active`]:
              uploading && currentType && currentType === type,
          })}
        >
          <progress max="1" value={progress}>
            <div className="progress-text">{(progress * 100).toFixed(1)}%</div>
          </progress>
          <button className="cancel" onClick={uploadFileCancel} type="button">
            <SkipSvg className="icon" />
            {t('Cancel')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('upload-indicator', {
        [`${type} active`]: uploading && currentType && currentType === type,
      })}
    >
      <progress max="1" value={progress}>
        <div className="progress-text">{(progress * 100).toFixed(1)}%</div>
      </progress>
    </div>
  )
}
