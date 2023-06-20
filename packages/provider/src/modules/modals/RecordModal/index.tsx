import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { BackSvg, CamSvg, CloseSvg } from '../../../icons'
import Tabs from '../../../components/Tabs'
import Button from '../../../components/Button'
import useComponent, { RecordModalProps } from './useComponent'
import './styles.css'

export default function RecordModal(props: RecordModalProps) {
  const {
    store: { record, opened },
    refs: { backdrop },
    data: { activeTab, isSupportedVideo, isDownloading },
    handlers: {
      onBackdropClick,
      onCancelClick,
      setActiveTab,
      handleVideoError,
      handleDownloadRecord,
    },
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
      <div className="container">
        <div className="header-card">
          <button className="back" type="button" onClick={onCancelClick}>
            <BackSvg className="icon" />
          </button>
        </div>
        <div className="record-col-video">
          {!AI_RECORD_ANALYTICS && (
            <div className="record-col-video-close">
              <CloseSvg className="record-icon-close" onClick={onCancelClick} />
            </div>
          )}
          {isSupportedVideo && record?.uid ? (
            <video
              src={QB.content.privateUrl(record.uid)}
              onError={handleVideoError}
              controls
            />
          ) : (
            <div className="video-unavailable">
              <CamSvg className="icon" />
              <p className="message">{t('VideoUnavailable')}</p>
              <p className="description">
                {t(
                  isSupportedVideo
                    ? 'VideoNotSavedMessage'
                    : 'VideoNotSupportedMessage',
                )}
              </p>
              {!isSupportedVideo && record?.uid && (
                <Button onClick={handleDownloadRecord} loading={isDownloading}>
                  {t('Download')}
                </Button>
              )}
            </div>
          )}
        </div>
        {AI_RECORD_ANALYTICS && (
          <div className="record-col-info">
            <CloseSvg className="record-icon-close" onClick={onCancelClick} />
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              className="record-tabs"
            >
              <Tabs.Tab name="summary" title={t('Summary')}>
                <div className="record-info-text">{record?.summary}</div>
                <div className="record-info-text">
                  <div className="record-actions-title">
                    {t('ActionPoints')}
                  </div>
                  <div className="record-actions-info">{record?.actions}</div>
                </div>
              </Tabs.Tab>
              <Tabs.Tab name="transcript" title={t('Transcript')}>
                <div className="record-info-text">
                  {record?.transcription?.map((transcription) => {
                    const [time, text] = transcription.split('|')

                    return (
                      <div key={time} className="record-transcript">
                        <div className="record-transcript-time">{time}</div>
                        <div className="record-transcript-text">{text}</div>
                      </div>
                    )
                  })}
                </div>
              </Tabs.Tab>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
