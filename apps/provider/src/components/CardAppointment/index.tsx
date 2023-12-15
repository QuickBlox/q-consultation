import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { QBAppointment, QBUser } from '@qc/quickblox'
import { FULL_DATE_SHORT_FORMAT } from '@qc/template/dateFormat'

import ChevronRightSvg from '@qc/icons/navigation/next.svg'
import { parseUser } from '../../utils/user'
import Avatar from '../Avatar'
import Skeleton from '../Skeleton'
import { localizedFormat } from '../../utils/calendar'
import './styles.css'

interface CardAppointmentProps {
  appointment: QBAppointment
  user?: QBUser
  className?: string
  showUserInfo?: boolean
  loading?: boolean
  avatar?: {
    loading: boolean
    blob?: Blob | File
    error?: string
  }
  onClick?: () => void
}

export default function CardAppointment(props: CardAppointmentProps) {
  const {
    appointment,
    user,
    className,
    showUserInfo,
    loading,
    avatar,
    onClick,
  } = props
  const { t } = useTranslation()
  const currentUser = user && parseUser(user)
  const userName =
    currentUser?.full_name ||
    currentUser?.login ||
    currentUser?.phone ||
    currentUser?.email ||
    t('Unknown')

  return (
    <div className={cn('appointment-card', className)} onClick={onClick}>
      <div className="info">
        <p className="title">
          {localizedFormat(
            appointment.date_end || appointment.updated_at * 1000,
            FULL_DATE_SHORT_FORMAT,
          )}
        </p>
        {showUserInfo && (
          <div className="user-info">
            {!avatar || avatar.loading ? (
              <Skeleton variant="circular" className="avatar" />
            ) : (
              <Avatar blob={avatar.blob} className="avatar" />
            )}
            {loading && !currentUser ? (
              <Skeleton />
            ) : (
              <span className="user-name">{userName}</span>
            )}
          </div>
        )}
        <p className="description">{appointment.description}</p>
      </div>
      <ChevronRightSvg className={cn('icon', { 'icon-top': !showUserInfo })} />
    </div>
  )
}
