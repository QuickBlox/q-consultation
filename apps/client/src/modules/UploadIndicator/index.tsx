import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import SkipSvg from '@qc/icons/navigation/close.svg'
import useComponent from './useComponent'
import './styles.css'

export default function UploadIndicator() {
  const {
    store: { progress, uploading },
    actions: { uploadFileCancel },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <div className="upload-indicator-wrapper">
      <div className={cn('upload-indicator', { active: uploading })}>
        <progress max="1" value={progress}>
          <div className="progress-text">{`${(progress * 100).toFixed(
            1,
          )}%`}</div>
        </progress>
        <button className="cancel" onClick={uploadFileCancel} type="button">
          <SkipSvg className="icon" />
          {t('Cancel')}
        </button>
      </div>
    </div>
  )
}
