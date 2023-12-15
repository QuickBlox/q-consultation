import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import QB from '@qc/quickblox'

import BackSvg from '@qc/icons/navigation/arrow-left.svg'
import CamSvg from '@qc/icons/toggle/camera-off.svg'
import CloseSvg from '@qc/icons/navigation/close.svg'
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
      <div className={cn('container', { 'active-ai': !AI_RECORD_ANALYTICS })}>
        <div className="header-card">
          {!AI_RECORD_ANALYTICS && (
            <div className="cross-mark">
              <CloseSvg className="icon-cross-mark" onClick={onCancelClick} />
            </div>
          )}
          <button className="back" type="button" onClick={onCancelClick}>
            <BackSvg className="icon" />
          </button>
        </div>
        <div className="record-col-video">
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
            <CloseSvg
              className="record-icon-cross-mark"
              onClick={onCancelClick}
            />
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              className="record-tabs"
            >
              <Tabs.Tab name="summary" title={t('Summary')}>
                {record?.summary && record?.actions ? (
                  <div>
                    <div className="record-info-text">{record?.summary}</div>
                    <div className="record-info-text">
                      <div className="record-actions-title">
                        {t('ActionPoints')}
                      </div>
                      <div className="record-actions-info">
                        {record?.actions}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="record-info-text">
                    {t('ConversationTooLong')}
                  </div>
                )}
              </Tabs.Tab>
              <Tabs.Tab name="transcript" title={t('Transcript')}>
                {record?.transcription?.length ? (
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
                ) : (
                  <div className="record-info-text">
                    {t('LongGenerateTranscription')}
                  </div>
                )}
              </Tabs.Tab>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
