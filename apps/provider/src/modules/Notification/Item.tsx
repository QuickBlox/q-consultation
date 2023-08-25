import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { Notification } from '../../actions'
import { CloseSvg } from '../../icons'
import './styles.css'

const DEFAULT_DURATION = 2 * SECOND
const ANIMATION_DURATION = 0.2 * SECOND

interface NotificationItemProps extends Notification {
  onExpire: (id: Notification['id']) => void
}

export default function NotificationItem(props: NotificationItemProps) {
  const {
    translate,
    translateOptions,
    message,
    position = 'bottom-center',
    type,
  } = props
  const { t } = useTranslation()

  const [active, setActive] = useState(false)

  const handleClose = () => {
    props.onExpire(props.id)
  }

  useEffect(() => {
    setActive(true)
  }, [])

  useEffect(() => {
    function expireCallback() {
      setActive(false)
      setTimeout(() => {
        props.onExpire(props.id)
      }, ANIMATION_DURATION)
    }
    let timeoutId: NodeJS.Timeout | null = null

    if (props.type !== 'cancel') {
      timeoutId = setTimeout(expireCallback, props.duration || DEFAULT_DURATION)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [props])

  return (
    <div className={cn('notification', type, position, { active })}>
      {translate ? t(message, translateOptions) : message}
      {type === 'cancel' && (
        <CloseSvg className="icon-close" onClick={handleClose} />
      )}
    </div>
  )
}
