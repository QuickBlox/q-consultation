import moment from 'moment'
import { useTranslation } from 'react-i18next'

import Accordeon from '../../components/Accordeon'
import { EditSvg, FileVideoSvg } from '../../icons'
import useComponent, { AppointmentInfoProps } from './useComponent'
import './styles.css'

export default function AppointmentInfo(props: AppointmentInfoProps) {
  const { appointment, records } = props
  const {
    data: { description, userInfo, appointmentRecords, fieldActive },
    handlers: { toggleField, startEditingNotes },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderControls = () => (
    <EditSvg className="icon edit" onClick={startEditingNotes} />
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
            {userInfo.birthdate &&
              moment(userInfo.birthdate, moment.HTML5_FMT.DATE).format('L')}
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
        className="notes"
        onClick={() => toggleField('notes')}
        title={t('Notes')}
        open={fieldActive === 'notes'}
        renderControls={appointment ? renderControls : undefined}
      >
        {appointment?.notes}
      </Accordeon>
      <Accordeon
        className="records-list"
        onClick={() => toggleField('records')}
        title={t('VideoRecords')}
        open={fieldActive === 'records'}
      >
        {appointment?.records?.length !== undefined && (
          <ul className="record-list">
            {appointmentRecords?.map(
              (id) =>
                records?.[id] && (
                  <li key={id} className="record-item">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                      href={QB.content.privateUrl(records[id].uid)}
                    >
                      <FileVideoSvg className="icon file-video" />
                      {records[id].name}
                    </a>
                  </li>
                ),
            )}
          </ul>
        )}
      </Accordeon>
    </div>
  )
}
