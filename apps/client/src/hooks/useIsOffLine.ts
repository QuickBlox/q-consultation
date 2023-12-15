import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  authHasSessionSelector,
  chatConnectedSelector,
  qbReadySelector,
} from '../selectors'
import { createMapStateSelector } from '../utils/selectors'

const selector = createMapStateSelector({
  connected: chatConnectedSelector,
  ready: qbReadySelector,
  hasSession: authHasSessionSelector,
})

export default function useIsOffLine() {
  const store = useSelector(selector)
  const [isOnLine, setIsOnLine] = useState(window.navigator.onLine)

  const { ready, hasSession, connected } = store
  const isNotConnected = ready && hasSession && !connected

  useEffect(() => {
    const onChange = () => {
      setIsOnLine(window.navigator.onLine)
    }

    window.addEventListener('online', onChange)
    window.addEventListener('offline', onChange)

    return () => {
      window.removeEventListener('online', onChange)
      window.removeEventListener('offline', onChange)
    }
  }, [])

  return !isOnLine || isNotConnected
}
