import { useTranslation } from 'react-i18next'
import { format, parseISO, isMatch } from 'date-fns'

import SkipSvg from '@qc/icons/navigation/close.svg'
import CheckSvg from '@qc/icons/status/sent.svg'
import FileVideoSvg from '@qc/icons/media/video-file.svg'
import Accordeon from '../../components/Accordeon'
import useComponent, { AppointmentInfoProps } from './useComponent'
import { TextAreaField } from '../../components/Field'
import './styles.css'

export default function AppointmentInfo(props: AppointmentInfoProps) {
  const { appointment, records } = props
  const {
    data: { description, userInfo, notes, fieldActive, isOffline },
    handlers: {
      toggleField,
      startEditingNotes,
      stopEditingNotes,
      updateNotes,
      changeNotes,
      editingNotes,
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
        <SkipSvg className="icon" />
      </button>
    </>
  )

  return (
    <div className="appointment-info">
      <Accordeon
        className="user-info"
        onClick={() => toggleField('user-info')}
        title={t('ClientInfo')}
        open={fieldActive === 'user-info'}
      >
        <div className="item birthdate">
          <label className="label">{t('Birthdate')}:</label>
          <span className="value">
            {userInfo.birthdate && isMatch(userInfo.birthdate, 'yyyy-MM-dd')
              ? format(parseISO(userInfo.birthdate), 'P')
              : t('Unknown')}
          </span>
        </div>
        <div className="item gender">
          <label className="label">{t('Gender')}:</label>
          <span className="value">
            {userInfo.gender && t(`${userInfo.gender}`)}
          </span>
        </div>
        <div className="item address">
          <label className="label">{t('Address')}:</label>
          <span className="value">{userInfo.address}</span>
        </div>
      </Accordeon>
      <Accordeon
        className="description"
        onClick={() => toggleField('description')}
        title={t('ConsultationTopic')}
        open={fieldActive === 'description'}
      >
        {description}
      </Accordeon>
      <Accordeon
        className="records-list"
        onClick={() => toggleField('records')}
        title={t('VideoRecords')}
        open={fieldActive === 'records'}
      >
        {records?.length !== undefined && (
          <ul className="record-list">
            {records?.map((record) => (
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
        open
        disableCollapse
        className="notes"
        title={t('Notes')}
        renderControls={editingNotes ? renderControls : undefined}
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
    </div>
  )
}
