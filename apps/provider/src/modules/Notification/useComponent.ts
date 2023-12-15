import { useSelector } from 'react-redux'

import { hideNotification } from '../../actionCreators'
import { notificationSelector } from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { Notification } from '../../actions'
import { createMapStateSelector } from '../../utils/selectors'

const selector = createMapStateSelector({
  notifications: notificationSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({ hideNotification })

  const onExpire = (id: Notification['id']) => actions.hideNotification(id)

  return {
    store,
    handlers: { onExpire },
  }
})
