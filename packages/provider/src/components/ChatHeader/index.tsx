import { useTranslation } from 'react-i18next'

import MoreMenu from '../../modules/MoreMenu'
import { CallSvg, CheckSvg } from '../../icons'
import {
  startCall as startCallAction,
  updateAppointment as updateAppointmentAction,
} from '../../actionCreators'
import './styles.css'
import Skeleton from '../Skeleton'

interface ChatHeaderProps {
  connected: boolean
  appointment?: QBAppointment
  session?: QBWebRTCSession
  currentUser?: QBUserWithCustomData
  dialogName?: string
  loading?: boolean
  startCall: typeof startCallAction
  updateAppointment: typeof updateAppointmentAction
}

enum PRIORITY {
  LOW,
  MED,
  HIGH,
}

export default function ChatHeader(props: ChatHeaderProps) {
  const {
    connected,
    appointment,
    currentUser,
    dialogName = '\u00A0',
    session,
    loading,
    startCall,
    updateAppointment,
  } = props
  const { t } = useTranslation()
  const isDisabledButtons = !connected || !appointment
  const currentUserName =
    dialogName && currentUser
      ? currentUser.full_name || currentUser.login || currentUser.email
      : '\u00A0'
  const inCallWithCurrentUser =
    appointment && session
      ? session.opponentsIDs
          .concat(session.initiatorID)
          .includes(appointment.client_id)
      : false

  const onPriorityBtnClick = (to: PRIORITY) => () => {
    if (appointment && appointment.priority !== to) {
      updateAppointment({
        _id: appointment._id,
        data: { priority: to },
      })
    }
  }

  const handleCall = () => {
    if (appointment && !session) {
      startCall({
        appointmentId: appointment._id,
        callType: QB.webrtc.CallType.VIDEO,
        opponentsIds: [appointment.client_id],
      })
    }
  }

  return (
    <header className="chat-header">
      <div className="section assignee-info">
        <div className="priority-and-name">
          {appointment && loading ? (
            <Skeleton />
          ) : (
            <div className="name">{dialogName}</div>
          )}
          <span className="priority-label">{t('ChangePriority')}</span>
          <div className="priority-buttons">
            <button
              className="priority high"
              disabled={isDisabledButtons}
              onClick={onPriorityBtnClick(PRIORITY.HIGH)}
              title={t('HighPriority')}
              type="button"
            >
              {appointment && appointment.priority === PRIORITY.HIGH && (
                <CheckSvg className="icon" />
              )}
            </button>
            <button
              className="priority med"
              disabled={isDisabledButtons}
              onClick={onPriorityBtnClick(PRIORITY.MED)}
              title={t('MediumPriority')}
              type="button"
            >
              {appointment && appointment.priority === PRIORITY.MED && (
                <CheckSvg className="icon" />
              )}
            </button>
            <button
              className="priority low"
              disabled={isDisabledButtons}
              onClick={onPriorityBtnClick(PRIORITY.LOW)}
              title={t('LowPriority')}
              type="button"
            >
              {appointment && appointment.priority === PRIORITY.LOW && (
                <CheckSvg className="icon" />
              )}
            </button>
          </div>
          <button
            className="call"
            disabled={isDisabledButtons || Boolean(session)}
            onClick={handleCall}
            title={t('Call')}
            type="button"
          >
            <CallSvg className="icon" />
          </button>
        </div>
        <div className="assignee">
          <span className="label muted">{t('Assignee')}</span>
          <div className="assignee-row">
            <span className="name">{currentUserName}</span>
            {dialogName && currentUser && (
              <MoreMenu
                disabled={isDisabledButtons || inCallWithCurrentUser}
                appointmentId={appointment?._id}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
