import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'

import {
  logout,
  toggleShowModal,
  stopCall,
  logoutSuccess,
} from '../../../actionCreators'
import {
  authLoadingSelector,
  callIsActiveSelector,
  callSessionSelector,
  contentLoadingSelector,
  modalLogoutSelector,
  recorderRecordingSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { createMapStateSelector } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'

export interface LogoutModalProps {
  onClose?: () => void
}

const selector = createMapStateSelector({
  opened: modalLogoutSelector,
  loading: authLoadingSelector,
  uploading: contentLoadingSelector,
  recording: recorderRecordingSelector,
  onCall: callIsActiveSelector,
  session: callSessionSelector,
})

export default createUseComponent((props: LogoutModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    logout,
    toggleShowModal,
    stopCall,
    logoutSuccess,
  })
  const { loading, onCall, recording, uploading, session } = store
  const [isSignOut, setIsSignOut] = useState(false)
  const backdrop = useRef<HTMLDivElement>(null)
  const isOffline = useIsOffLine()

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'LogoutModal' })

    if (onClose) {
      onClose()
    }
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isSignOut && backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const signOut = () => {
    actions.logout()
  }

  const handleSignOut = () => {
    if (isOffline) {
      if (onCall && session) {
        const tracks = session.localStream?.getTracks()

        tracks?.forEach((track) => track.stop())
      }
      actions.logoutSuccess()
    } else if (onCall) {
      setIsSignOut(true)
      actions.stopCall()
    } else {
      signOut()
    }
  }

  useEffect(() => {
    if (isSignOut && !loading && !onCall && !recording && !uploading) {
      signOut()
    }
  }, [isSignOut, loading, onCall, recording, uploading])

  return {
    store,
    actions,
    refs: { backdrop },
    data: { isSignOut },
    handlers: {
      onBackdropClick,
      onCancelClick,
      handleSignOut,
    },
  }
})
