import { useTranslation } from 'react-i18next'

import Button from '../../components/Button'
import AccentContainer from '../../components/AccentContainer'
import { SkipSvg, CheckSvg, EditSvg, RadarCircleSvg } from '../../icons'
import useComponent, { AppointmentProps } from './useComponent'
import './styles.css'

export default function Appointment(props: AppointmentProps) {
  const { onOpen } = props
  const {
    store: { appointment, myAccount },
    data: { description, editingDescription, isOffline },
    handlers: {
      changeDescription,
      startEditingDescription,
      stopEditingDescription,
      toggleLeaveQueueModal,
      updateDescription,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div className="appointment-container">
      <div className="appointment">
        <div className="description">
          <h2>{t('JoinedQueue')}</h2>
          <p>{t('WaitDoctor', { name: myAccount?.full_name })}</p>
          <p>{t('WhileWaiting')}</p>
          <p>{t('ThankYou')}</p>

          <RadarCircleSvg className="radar-circle" />

          <p>
            {t('PleaseWait')}
            ...
          </p>
        </div>
        <AccentContainer
          active={editingDescription}
          onClose={stopEditingDescription}
        >
          <form>
            <fieldset>
              <div className="legend">
                <span className="label">{t('ConsultationTopic')}</span>
                {editingDescription && (
                  <button
                    className="cancel"
                    onClick={stopEditingDescription}
                    type="button"
                  >
                    <SkipSvg className="icon" />
                  </button>
                )}
                {editingDescription ? (
                  <button
                    className="save"
                    onClick={updateDescription}
                    type="button"
                    disabled={isOffline}
                  >
                    <CheckSvg className="icon check" />
                  </button>
                ) : (
                  <button
                    className="edit"
                    disabled={!appointment}
                    onClick={startEditingDescription}
                    type="button"
                  >
                    <EditSvg className="icon" />
                  </button>
                )}
              </div>
              <textarea
                id="description"
                name="description"
                onChange={changeDescription}
                readOnly={!editingDescription}
                rows={8}
                value={description}
              />
            </fieldset>
          </form>
        </AccentContainer>
        <div className="btn-group">
          <button
            type="button"
            className="btn-leave"
            disabled={!appointment}
            onClick={toggleLeaveQueueModal}
          >
            {t('LeaveQueue')}
          </button>
          <Button
            className="btn-chat"
            disabled={isOffline}
            theme="primary"
            onClick={onOpen}
          >
            {t('OpenChat')}
          </Button>
        </div>
      </div>
    </div>
  )
}
