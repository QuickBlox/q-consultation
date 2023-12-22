import cn from 'classnames'
import RobotSvg from '@qc/icons/actions/ai.svg'
import CloseSvg from '@qc/icons/navigation/close.svg'

import ChatMessages from '../ChatMessages'
import ChatInput from '../ChatInput'
import useComponent, { ChatWidgetProps } from './useComponent'
import './styles.css'

export default function ChatWidget(props: ChatWidgetProps) {
  const {
    refs: { chatInputRef, containerRef },
    data: { isShowChat, dialogName, dialogId },
    handlers: { handleSetInputValue, handleClickToggleAssistant },
  } = useComponent(props)

  return (
    <div className="chat-widget" ref={containerRef}>
      <div className={cn('cw-dialog', { opened: isShowChat })}>
        <div className="cwd-header">
          <div className="dialog-info">
            <span className="dialog-name">{dialogName}</span>
          </div>
          <button
            className="back"
            type="button"
            onClick={handleClickToggleAssistant}
          >
            <CloseSvg className="icon-close" />
          </button>
        </div>
        <div className="cwd-main">
          <ChatMessages
            dialogId={dialogId}
            setInputValue={handleSetInputValue}
          />
          <ChatInput dialogId={dialogId} texboxRef={chatInputRef} />
        </div>
      </div>
      <button
        type="button"
        title={dialogName}
        className="cw-assistant"
        onClick={handleClickToggleAssistant}
      >
        <RobotSvg />
      </button>
    </div>
  )
}
