import { RefObject, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  stopCall,
  switchCamera,
  toggleMuteAudio,
  toggleMuteVideo,
  toggleScreenSharing,
  startRecord,
  stopRecord,
  toggleShowModal,
  sessionCloseEvent,
} from '../../actionCreators'
import { createUseComponent, useActions } from '../../hooks'
import {
  callMuteAudioSelector,
  callMuteVideoSelector,
  callScreenshareSelector,
  callSessionSelector,
  callVideoInputSourcesSelector,
  recorderRecordingSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface CallControlsProps {
  fullscreenElement: RefObject<HTMLDivElement>
}

const selector = createMapStateSelector({
  muteAudio: callMuteAudioSelector,
  muteVideo: callMuteVideoSelector,
  recording: recorderRecordingSelector,
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
    startRecord,
    stopRecord,
    toggleShowModal,
    sessionCloseEvent,
  })
  const { session, recording } = store
  const [fullscreen, setFullscreen] = useState(false)
  const isOffline = useIsOffLine()
  const fullscreenEnabled: boolean =
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
  const recorderUnavailable = QBMediaRecorder.isAvailable() === false

  const toggleRecord = () => {
    if (recording) {
      actions.stopRecord()
    } else {
      const localVideoElement =
        document.querySelector<HTMLVideoElement>('video#local')
      const remoteVideoElement =
        document.querySelector<HTMLVideoElement>('video[id^=remote]')

      if (remoteVideoElement && remoteVideoElement.srcObject) {
        const mixedStream = new MediaStream()
        const remoteStream = remoteVideoElement.srcObject as MediaStream

        mixedStream.addTrack(remoteStream.getVideoTracks()[0])
        const remoteAudioTrack = remoteStream.getAudioTracks()[0]
        const audioCtx = new AudioContext()
        const dst = audioCtx.createMediaStreamDestination()
        const remoteAudioStream = new MediaStream([remoteAudioTrack])

        audioCtx.createMediaStreamSource(remoteAudioStream).connect(dst)

        if (localVideoElement && localVideoElement.srcObject) {
          audioCtx
            .createMediaStreamSource(localVideoElement.srcObject as MediaStream)
            .connect(dst)
        }

        mixedStream.addTrack(dst.stream.getTracks()[0])

        actions.startRecord(mixedStream)
      }
    }
  }

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

  const toggleSwitchCamera = () => {
    actions.toggleShowModal({ modal: 'CameraModal' })
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
      recorderUnavailable,
      fullscreenEnabled,
      fullscreen,
      isOffline,
    },
    handlers: {
      toggleRecord,
      toggleFullscreen,
      toggleSwitchCamera,
    },
  }
})
