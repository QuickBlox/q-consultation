import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { format, parse } from 'date-fns'

import BackSvg from '@qc/icons/navigation/arrow-left.svg'
import CheckSvg from '@qc/icons/status/sent.svg'
import FileVideoSvg from '@qc/icons/media/video-file.svg'
import CloseSvg from '@qc/icons/navigation/close.svg'
import Avatar from '../../../components/Avatar'
import ChatMessages from '../../ChatMessages'
import Tabs from '../../../components/Tabs'
import Accordeon from '../../../components/Accordeon'
import useComponent, { AppointmentDetailsModalProps } from './useComponent'
import './styles.css'
import { ABOUT_TAB, CHAT_TAB } from '../../../constants/tabs'
import { TextAreaField } from '../../../components/Field'
import Skeleton from '../../../components/Skeleton'

export default function AppointmentDetailsModal(
  props: AppointmentDetailsModalProps,
) {
  const {
    store: { appointment, records, opened },
    data: {
      localDate,
      accordeonActive,
      userName,
      currentUser,
      activeTab,
      RESOLUTION_XS,
      isOffline,
      notes,
      userAvatar,
    },
    refs: { backdrop },
    handlers: {
      toggleAccordeon,
      onBackdropClick,
      onCancelClick,
      setActiveTab,
      startEditingNotes,
      updateNotes,
      stopEditingNotes,
      editingNotes,
      changeNotes,
      handleOpenRecordModal,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderControls = () => (
    <>
      <button
        type="button"
        className="save"
        onClick={updateNotes}
        disabled={isOffline}
      >
        <CheckSvg className="icon check" />
      </button>
      <button type="button" className="cancel" onClick={stopEditingNotes}>
        <CloseSvg className="icon" />
      </button>
    </>
  )

  const renderDropList = () => (
    <>
      <Accordeon
        onClick={() => toggleAccordeon('client-info')}
        title={t('ClientInfo')}
        open={accordeonActive === 'client-info'}
      >
        <div className="item birthdate">
          <label className="label">{t('Birthdate')}:</label>
          <span className="value">
            {currentUser?.custom_data?.birthdate &&
              format(
                parse(
                  currentUser.custom_data.birthdate,
                  'yyyy-MM-dd',
                  new Date(),
                ),
                'P',
              )}
          </span>
        </div>
        <div className="item gender">
          <label className="label">{t('Gender')}:</label>
          <span className="value">
            {currentUser?.custom_data?.gender &&
              t(`${currentUser.custom_data.gender.toLowerCase()}`)}
          </span>
        </div>
        <div className="item address">
          <label className="label">{t('Address')}:</label>
          <span className="value">{currentUser?.custom_data?.address}</span>
        </div>
      </Accordeon>
      <Accordeon
        onClick={() => toggleAccordeon('consultation-topic')}
        title={t('ConsultationTopic')}
        open={accordeonActive === 'consultation-topic'}
      >
        {appointment?.description}
      </Accordeon>
      {appointment?.date_end ? (
        <>
          <Accordeon
            onClick={() => toggleAccordeon('video-records')}
            title={t('VideoRecords')}
            open={accordeonActive === 'video-records'}
          >
            {records?.length !== undefined && (
              <ul className="record-list">
                {records.map((record) => (
                  <li key={record._id} className="record-item">
                    <div onClick={() => handleOpenRecordModal(record._id)}>
                      <FileVideoSvg className="icon file-video" />
                      {record.name}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Accordeon>
          <Accordeon
            open={accordeonActive === 'notes'}
            className="notes"
            title={t('Notes')}
            onClick={() => toggleAccordeon('notes')}
          >
            {notes}
          </Accordeon>
          <Accordeon
            onClick={() => toggleAccordeon('conclusion')}
            title={t('Conclusion')}
            open={accordeonActive === 'conclusion'}
          >
            {appointment?.conclusion}
          </Accordeon>
        </>
      ) : (
        <Accordeon
          open={accordeonActive === 'notes'}
          className="notes"
          title={t('Notes')}
          renderControls={editingNotes ? renderControls : undefined}
          onClick={() => toggleAccordeon('notes')}
        >
          <TextAreaField
            id="notes"
            name="notes"
            placeholder={t('EnterNotes')}
            className="field-input"
            onChange={changeNotes}
            onFocus={startEditingNotes}
            disabled={!appointment}
            value={notes || ''}
            rows={8}
          />
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
            <p className="title">{localDate}</p>
          </div>
          <div className="header-info">
            <div className="user-info">
              {!userAvatar || userAvatar.loading ? (
                <Skeleton variant="circular" className="avatar" />
              ) : (
                <Avatar blob={userAvatar.blob} className="avatar" />
              )}
              <span className="user-name">{userName}</span>
            </div>
          </div>
        </div>
        {appointment?.date_end && RESOLUTION_XS ? (
          <div className="tab-wrapper">
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.Tab name={ABOUT_TAB} title={t('About')}>
                {renderDropList()}
              </Tabs.Tab>
              <Tabs.Tab name={CHAT_TAB} title={t('Chat')}>
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
