import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import CallControls from '../CallControls'
import useComponent from './useComponent'
import './styles.css'

interface VideoCallProps {
  dialogName?: string
}

export default function VideoCall(props: VideoCallProps) {
  const { dialogName } = props
  const {
    store: { opponent, opponentId, callDuration },
    refs: { callScreenRef },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <div className="call-screen-container">
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
        <CallControls fullscreenElement={callScreenRef} />
      </div>
    </div>
  )
}
