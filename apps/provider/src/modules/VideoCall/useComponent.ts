import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { createUseComponent } from '../../hooks'
import {
  callDurationSelector,
  usersCallOpponentSelector,
  callOpponentIdSelector,
  callSessionSelector,
  callRemoteStreamSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'

const selector = createMapStateSelector({
  callDuration: callDurationSelector,
  opponent: usersCallOpponentSelector,
  opponentId: callOpponentIdSelector,
  callSession: callSessionSelector,
  remoteStream: callRemoteStreamSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const { opponentId, callSession, remoteStream } = store

  const callScreenRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isReady && callSession) {
      if (callSession.localStream) {
        callSession.attachMediaStream('local', callSession.localStream)
      }

      if (opponentId && remoteStream) {
        callSession.attachMediaStream(`remote-${opponentId}`, remoteStream)
      }
    }
  }, [isReady, opponentId, callSession, remoteStream])

  useEffect(() => {
    setIsReady(true)

    return () => {
      setIsReady(false)
    }
  }, [])

  return {
    store,
    refs: {
      callScreenRef,
    },
  }
})
