import { RefObject, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  stopCall,
  switchCamera,
  toggleMuteAudio,
  toggleMuteVideo,
  toggleScreenSharing,
} from '../../actionCreators'
import { createUseComponent, useActions } from '../../hooks'
import {
  callMuteAudioSelector,
  callMuteVideoSelector,
  callScreenshareSelector,
  callSessionSelector,
  callVideoInputSourcesSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface CallControlsProps {
  fullscreenElement: RefObject<HTMLDivElement>
}

const selector = createMapStateSelector({
  muteAudio: callMuteAudioSelector,
  muteVideo: callMuteVideoSelector,
  screenshare: callScreenshareSelector,
  session: callSessionSelector,
  videoInputSources: callVideoInputSourcesSelector,
})

export default createUseComponent((props: CallControlsProps) => {
  const { fullscreenElement } = props
  const store = useSelector(selector)
  const actions = useActions({
    stopCall,
    switchCamera,
    toggleMuteAudio,
    toggleMuteVideo,
    toggleScreenSharing,
  })
  const { session } = store
  const [fullscreen, setFullscreen] = useState(false)
  const [cameraModalOpened, setCameraModalOpened] = useState(false)
  const isOffline = useIsOffLine()
  const fullscreenEnabled: boolean =
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled

  const toggleFullscreen = () => {
    if (fullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setFullscreen(false)
    } else if (fullscreenElement.current) {
      if (fullscreenElement.current.requestFullscreen) {
        fullscreenElement.current.requestFullscreen()
      } else if (fullscreenElement.current.webkitRequestFullscreen) {
        fullscreenElement.current.webkitRequestFullscreen()
      } else if (fullscreenElement.current.mozRequestFullScreen) {
        fullscreenElement.current.mozRequestFullScreen()
      } else if (fullscreenElement.current.msRequestFullscreen) {
        fullscreenElement.current.msRequestFullscreen()
      }
      setFullscreen(true)
    }
  }

  const closeCameraModal = () => {
    setCameraModalOpened(false)
  }

  const toggleSwitchCamera = () => {
    setCameraModalOpened(true)
  }

  useEffect(() => {
    const onFullscreenChange: EventListener = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        setFullscreen(false)
      }
    }

    if (fullscreen) {
      document.addEventListener('fullscreenchange', onFullscreenChange)
    }

    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [fullscreen])

  useEffect(() => {
    if (fullscreen && !session) {
      toggleFullscreen()
    }
  }, [fullscreen, session])

  return {
    store,
    actions,
    data: {
      cameraModalOpened,
      fullscreenEnabled,
      fullscreen,
      isOffline,
    },
    handlers: {
      toggleFullscreen,
      toggleSwitchCamera,
      closeCameraModal,
    },
  }
})
