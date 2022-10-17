import moment from 'moment'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { BackSvg, CloseSvg, DownloadSvg } from '../../../icons'
import Avatar from '../../../components/Avatar'
import ChatMessages from '../../ChatMessages'
import Tabs from '../../../components/Tabs'
import Accordeon from '../../../components/Accordeon'
import useComponent, { AppointmentDetailsModalProps } from './useComponent'
import {
  FULL_DATE_SHORT_FORMAT,
  TIME_FORMAT,
} from '../../../constants/dateFormat'
import './styles.css'
import { localizedFormat } from '../../../utils/calendar'

export default function AppointmentDetailsModal(
  props: AppointmentDetailsModalProps,
) {
  const {
    store: { appointment, opened },
    data: { accordeonActive, userName, currentUser, activeTab, RESOLUTION_XS },
    refs: { backdrop },
    handlers: {
      toggleAccordeon,
      onBackdropClick,
      onCancelClick,
      setActiveTab,
      onDownloadConclusion,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderTime = () => {
    if (
      appointment &&
      appointment.date_start &&
      appointment.date_end &&
      moment(appointment.date_end).isAfter(appointment.date_start)
    ) {
      return (
        <>
          <span className="date-divider" />
          {`${moment(appointment.date_start).format(TIME_FORMAT)} - ${moment(
            appointment.date_end,
          ).format(TIME_FORMAT)}`}
        </>
      )
    }

    return null
  }

  const renderControls = () => (
    <DownloadSvg className="icon download" onClick={onDownloadConclusion} />
  )

  const renderDropList = () => (
    <>
      <Accordeon
        onClick={() => toggleAccordeon('consultation-topic')}
        title={t('ConsultationTopic')}
        open={accordeonActive === 'consultation-topic'}
      >
        {appointment?.description}
      </Accordeon>
      {appointment?.date_end && (
        <Accordeon
          onClick={() => toggleAccordeon('conclusion')}
          title={t('Conclusion')}
          open={accordeonActive === 'conclusion'}
          renderControls={appointment?.conclusion ? renderControls : undefined}
        >
          {appointment?.conclusion}
        </Accordeon>
      )}
    </>
  )

  const renderChat = () => <ChatMessages dialogId={appointment?.dialog_id} />

  return (
    <div
      className={cn('modal appointment-details-modal', {
        'appointment-ended': appointment?.date_end,
        active: opened,
      })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="container">
        <div className="header-card">
          <div className="header-nav">
            <button className="back" type="button" onClick={onCancelClick}>
              <BackSvg className="icon" />
            </button>
            <p className="title">
              {appointment &&
                localizedFormat(
                  appointment.date_end ||
                    appointment.date_start ||
                    appointment.updated_at * 1000,
                  FULL_DATE_SHORT_FORMAT,
                )}
              {renderTime()}
            </p>
          </div>
          <div className="header-info">
            <div className="user-info">
              <Avatar
                className="avatar"
                url={
                  currentUser?.custom_data?.avatar?.uid &&
                  QB.content.privateUrl(currentUser.custom_data.avatar.uid)
                }
              />
              <span className="user-name">{userName}</span>
            </div>
          </div>
        </div>
        {appointment?.date_end && RESOLUTION_XS ? (
          <div className="tab-wrapper">
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.Tab name="about" title={t('About')}>
                {renderDropList()}
              </Tabs.Tab>
              <Tabs.Tab name="chat" title={t('Chat')}>
                {renderChat()}
              </Tabs.Tab>
            </Tabs>
          </div>
        ) : (
          <div className="sections-wrapper">
            {appointment?.date_end ? (
              <>
                <div className="col">{renderDropList()}</div>
                <div className="col">{renderChat()}</div>
              </>
            ) : (
              <div className="user-details">{renderDropList()}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
