import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { BackSvg, CamSvg, CloseSvg } from '../../../icons'
import Tabs from '../../../components/Tabs'
import useComponent, { RecordModalProps } from './useComponent'
import './styles.css'

export default function RecordModal(props: RecordModalProps) {
  const {
    store: { record, opened },
    refs: { backdrop },
    data: { activeTab },
    handlers: { onBackdropClick, onCancelClick, setActiveTab },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal record-modal', {
        active: opened,
      })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="container">
        <div className="header-card">
          <button className="back" type="button" onClick={onCancelClick}>
            <BackSvg className="icon" />
          </button>
        </div>
        <div className="record-col-video">
          {record?.uid ? (
            <video src={QB.content.privateUrl(record.uid)} controls />
          ) : (
            <div className="video-unavailable">
              <CamSvg className="icon" />
              <p className="message">{t('VideoUnavailable')}</p>
              <p className="description">{t('VideoNotSavedMessage')}</p>
            </div>
          )}
        </div>
        {AI_RECORD_ANALYTICS && (
          <div className="record-col-info">
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              className="record-tabs"
            >
              <Tabs.Tab name="summary" title={t('Summary')}>
                <div className="record-info-text">{record?.summary}</div>
              </Tabs.Tab>
              <Tabs.Tab name="transcript" title={t('Transcript')}>
                <div className="record-info-text">{record?.transcription}</div>
              </Tabs.Tab>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
