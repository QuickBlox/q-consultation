import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import CallControls from '../CallControls'
import useComponent from './useComponent'
import './styles.css'

interface VideoCallProps {
  dialogName?: string
  minimalistic?: boolean
}

export default function VideoCall(props: VideoCallProps) {
  const { dialogName, minimalistic } = props
  const {
    store: { opponent, opponentId, callDuration },
    refs: { callScreenRef },
    data: { fullscreen },
    handlers: { setFullscreen },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <div
      className={cn('call-screen-container', {
        minimalistic: !fullscreen && minimalistic,
      })}
    >
      <div className="call-screen" ref={callScreenRef}>
        <div className="videos">
          <div className="video-container">
            <div className="overlay">
              <p>
                {opponentId
                  ? opponent?.full_name || opponent?.login || t('Unknown')
                  : dialogName}
              </p>
              <p>{callDuration}</p>
            </div>
            {opponentId && (
              <video autoPlay id={`remote-${opponentId}`} playsInline />
            )}
          </div>
          <video
            autoPlay
            id="local"
            muted
            playsInline
            className={cn({ hide: !opponentId })}
          />
        </div>
        <CallControls
          fullscreen={fullscreen}
          minimalistic={minimalistic}
          fullscreenElement={callScreenRef}
          setFullscreen={setFullscreen}
        />
      </div>
    </div>
  )
}
