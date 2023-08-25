import cn from 'classnames'

import useComponent from './useComponent'
import './styles.css'

export default function UploadRecordIndicator() {
  const {
    data: { progressValue },
    store: { progress, uploading },
  } = useComponent()

  return (
    <div
      className={cn('upload-record-indicator', {
        active: uploading && typeof progress === 'number',
      })}
    >
      <progress max="1" value={progressValue}>
        <div className="progress-text">{(progressValue * 100).toFixed(1)}%</div>
      </progress>
    </div>
  )
}
