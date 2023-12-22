import cn from 'classnames'

import ChatSvg from '@qc/icons/actions/chat.svg'
import Chat from '../Chat'
import CallControls from '../CallControls'
import Header from '../Header'
import useComponent from './useComponent'
import './styles.css'

export default function VideoCall() {
  const {
    data: { videoCallName, chatOpen },
    refs: { callScreenRef },
    store: {
      appointmentId,
      callDuration,
      onCall,
      opponentId,
      hasUnreadMessage,
    },
    handlers: { setChatOpen },
  } = useComponent()

  return (
    <div className={cn('call-screen', { active: onCall })} ref={callScreenRef}>
      <div className="call-screen-content">
        <button
          className={cn('chat', { unread: hasUnreadMessage })}
          type="button"
          onClick={() => setChatOpen(true)}
        >
          <ChatSvg className="icon" />
        </button>
        <div className="videos">
          <div className="video-container">
            <div className="overlay">
              <p>{videoCallName}</p>
              <p>{callDuration}</p>
            </div>
            {opponentId && (
              <video autoPlay id={`remote-${opponentId}`} playsInline />
            )}
          </div>
          <video autoPlay id="local" muted playsInline />
        </div>
        <CallControls fullscreenElement={callScreenRef} />
      </div>
      {onCall && (
        <div className="chat-wrapper">
          <Header className="header-call" minimalistic />
          <Chat
            className="chat-room"
            opened={chatOpen}
            onClose={() => setChatOpen(false)}
            appointmentId={appointmentId}
            enableAttachments
            enableRephrase={AI_REPHRASE}
            enableTranslate={AI_TRANSLATE}
          />
        </div>
      )}
    </div>
  )
}
