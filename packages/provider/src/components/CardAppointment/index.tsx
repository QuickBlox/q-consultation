import { useTranslation } from 'react-i18next'
import moment from 'moment'
import cn from 'classnames'

import { parseUser } from '../../utils/user'
import Avatar from '../Avatar'
import Skeleton from '../Skeleton'
import { ChevronRightSvg } from '../../icons'
import { FULL_DATE_SHORT_FORMAT } from '../../constants/dateFormat'
import { localizedFormat } from '../../utils/calendar'
import './styles.css'

interface CardAppointmentProps {
  appointment: QBAppointment
  user?: QBUser
  onClick?: () => void
  className?: string
  showUserInfo?: boolean
  loading?: boolean
}

export default function CardAppointment(props: CardAppointmentProps) {
  const { appointment, user, onClick, className, showUserInfo, loading } = props
  const { t } = useTranslation()
  const currentUser = user && parseUser(user)
  const userName =
    currentUser?.full_name ||
    currentUser?.login ||
    currentUser?.phone ||
    currentUser?.email ||
    t('Unknown')

  const localDate =
    appointment &&
    localizedFormat(
      moment(
        appointment.date_end ||
          appointment.date_start ||
          appointment.updated_at * 1000,
      ),
      FULL_DATE_SHORT_FORMAT,
    )

  return (
    <div className={cn('appointment-card', className)} onClick={onClick}>
      <div className="info">
        <p className="title">{localDate}</p>
        {showUserInfo && (
          <div className="user-info">
            {loading && !currentUser ? (
              <Skeleton variant="circular" className="avatar" />
            ) : (
              <Avatar
                url={
                  currentUser?.custom_data?.avatar?.uid &&
                  QB.content.privateUrl(currentUser.custom_data.avatar.uid)
                }
                className="avatar"
              />
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
