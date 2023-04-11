import i18n from 'i18next'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { ChatSvg, SkipSvg, CallSvg } from '../../icons'
import Skeleton from '../../components/Skeleton'

interface AppointmentListItemProps {
  appointment: QBAppointment
  callDuration?: string
  hasUnreadMessage: boolean
  index: number
  onCall?: boolean
  onItemClick?: (item: QBAppointment) => void
  selected?: QBAppointment['_id']
  users: Dictionary<QBUser>
  loading?: boolean
  disabled?: boolean
}

const getWaitingTime = (from: number) => {
  const SECOND = 1000
  const MINUTE = 60 * SECOND
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR
  const result = []
  let diff = Date.now() - from

  if (diff < MINUTE * 20) {
    result.push(`< 20 ${i18n.t('NMinute', { count: 20 })}`)
  } else {
    if (diff > DAY) {
      const days = Math.floor(diff / DAY)

      result.push(`${days} ${i18n.t('NDay', { count: days })}`)
      diff -= DAY * days
    }

    if (diff > HOUR) {
      const hours = Math.floor(diff / HOUR)

      result.push(`${hours} ${i18n.t('NHour', { count: hours })}`)
      diff -= HOUR * hours
    }

    if (diff > MINUTE) {
      const minutes = Math.floor(diff / MINUTE)

      result.push(`${minutes} ${i18n.t('NMinute', { count: minutes })}`)
    }
  }

  return result.join(' ')
}

export default function AppointmentListItem(props: AppointmentListItemProps) {
  const {
    appointment,
    callDuration,
    hasUnreadMessage,
    index,
    onCall,
    onItemClick,
    selected,
    users,
    loading,
    disabled,
  } = props
  const { t } = useTranslation()

  const user = users[appointment.client_id]
  const isSelected = selected && selected === appointment._id
  const userName =
    user?.full_name ||
    user?.login ||
    user?.phone ||
    user?.email ||
    appointment?.description ||
    t('Unknown')
  const priority =
    typeof appointment.priority === 'number' ? appointment.priority : 0

  const itemClickHandler = () => {
    if (onItemClick) {
      onItemClick(appointment)
    }
  }

  let priorityClass = 'priority-'

  switch (priority) {
    case 0:
      priorityClass += 'low'
      break
    case 1:
      priorityClass += 'med'
      break
    case 2:
      priorityClass += 'high'
      break
    default:
      break
  }

  const renderTime = () => {
    if (onCall) return callDuration

    return getWaitingTime(appointment.created_at * 1000)
  }

  return (
    <div className={cn('appointment', { selected: isSelected })}>
      <button className="body" onClick={itemClickHandler} type="button">
        <div className={cn('index', priorityClass)}>{index + 1}</div>
        <div className="contact">
          {!user && loading ? (
            <Skeleton />
          ) : (
            <div className="name">{userName}</div>
          )}
          <div className="waiting-time">{renderTime()}</div>
        </div>
      </button>
      {onCall && (
        <button className="on-call" type="button">
          <CallSvg className="icon" />
        </button>
      )}
      {hasUnreadMessage && !onCall && (
        <button className="chat-unread" type="button">
          <ChatSvg className="icon" />
        </button>
      )}
    </div>
  )
}
