import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import BackSvg from '@qc/icons/navigation/arrow-left.svg'
import ChatMessages from '../ChatMessages'
import ChatInput from '../ChatInput'
import UploadIndicator from '../UploadIndicator'
import useComponent, { ChatProps } from './useComponent'
import './styles.css'

export default function Chat(props: ChatProps) {
  const {
    className,
    opened,
    onClose,
    enableAttachments,
    enableRephrase,
    enableTranslate,
  } = props
  const {
    data: { dialogName },
    store: { callDuration, currentDialog },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <aside className={cn('chat-container', className, { open: opened })}>
      <header>
        <button className="back" type="button" onClick={onClose}>
          <BackSvg className="icon" />
        </button>
        <div className="dialog-info">
          <span className="dialog-name">{dialogName}</span>
          {callDuration && Boolean(callDuration.length) && (
            <span className="call-time">
              {`${t('CallTime')} ${callDuration}`}
            </span>
          )}
        </div>
      </header>
      <main>
        <ChatMessages
          dialogId={currentDialog?._id}
          chatOpen={opened}
          enableTranslate={enableTranslate}
        />
        {enableAttachments && <UploadIndicator />}
        <ChatInput
          dialogId={currentDialog?._id}
          enableAttachments={enableAttachments}
          enableRephrase={enableRephrase}
        />
      </main>
    </aside>
  )
}
