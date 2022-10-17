import NotificationItem from './Item'
import useComponent from './useComponent'

export default function Notification() {
  const {
    store: { notifications },
    handlers: { onExpire },
  } = useComponent()

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onExpire={onExpire}
        />
      ))}
    </div>
  )
}
