import { useTranslation } from 'react-i18next'

import SkipSvg from '@qc/icons/navigation/close.svg'
import CheckSvg from '@qc/icons/status/sent.svg'
import RadarCircleSvg from '@qc/icons/status/loader.svg'
import Button from '../../components/Button'
import useComponent, { AppointmentProps } from './useComponent'
import './styles.css'

export default function Appointment(props: AppointmentProps) {
  const { onOpen } = props
  const {
    store: { appointment, myAccount },
    data: { description, editingDescription, isOffline, isNotAssistant },
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
          <div className="please-wait">
            {t('PleaseWait')}
            ...
          </div>
        </div>
        <Button
          className="btn-chat"
          disabled={isOffline}
          theme="primary"
          onClick={onOpen}
        >
          {t('OpenChat')}
        </Button>
        {isNotAssistant && (
          <form>
            <fieldset>
              <div className="legend">
                <span className="label">{t('ConsultationTopic')}</span>
                {editingDescription && (
                  <>
                    <button
                      className="save"
                      onClick={updateDescription}
                      type="button"
                      disabled={isOffline}
                    >
                      <CheckSvg className="icon check" />
                    </button>
                    <button
                      className="cancel"
                      onClick={stopEditingDescription}
                      type="button"
                    >
                      <SkipSvg className="icon" />
                    </button>
                  </>
                )}
              </div>
              <textarea
                id="description"
                name="description"
                placeholder={t('EnterQuestion')}
                onChange={changeDescription}
                onFocus={startEditingDescription}
                disabled={!appointment}
                rows={8}
                value={description}
              />
            </fieldset>
          </form>
        )}
        <div className="btn-group">
          <button
            type="button"
            className="btn-leave"
            disabled={!appointment}
            onClick={toggleLeaveQueueModal}
          >
            {t('LeaveQueue')}
          </button>
        </div>
      </div>
    </div>
  )
}
