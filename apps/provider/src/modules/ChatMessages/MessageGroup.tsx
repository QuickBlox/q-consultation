import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { QBUser, QBChatMessage } from '@qc/quickblox'
import { markMessageRead as markMessageReadAction } from '../../actionCreators'
import { getSentTime } from '../../utils/calendar'

interface ChatMessageProps {
  chatOpen?: boolean
  myAccountId: QBUser['id']
  messages: QBChatMessage[]
  users: Dictionary<QBUser>
  enableTranslate?: boolean
  enableQuickAnswer?: boolean
  markMessageRead: typeof markMessageReadAction
  renderMessage: (message: QBChatMessage, isMine: boolean) => JSX.Element
}

export default function ChatMessage(props: ChatMessageProps) {
  const {
    myAccountId,
    messages,
    users,
    markMessageRead,
    chatOpen,
    renderMessage,
    enableTranslate,
    enableQuickAnswer,
  } = props
  const lastMessage = messages[messages.length - 1]
  const { t } = useTranslation()

  const messageIsMine = lastMessage.sender_id === myAccountId
  const messageIsRead = messageIsMine
    ? true
    : typeof lastMessage.read_ids !== 'undefined' &&
      lastMessage.read_ids !== null &&
      lastMessage.read_ids.includes(myAccountId)

  useEffect(() => {
    if (chatOpen && !messageIsRead) {
      markMessageRead({
        myAccountId,
        dialogId: lastMessage.chat_dialog_id,
        messageId: lastMessage._id,
        userId: lastMessage.sender_id,
      })
    }
  }, [chatOpen, messageIsRead, lastMessage])

  const sender = messageIsMine
    ? { full_name: t('You') }
    : users[lastMessage.sender_id]
  let senderName = null

  if (sender) {
    senderName =
      'login' in sender
        ? sender.full_name || sender.login || sender.email
        : sender.full_name
  } else {
    senderName = lastMessage.sender_id
  }

  return (
    <div
      className={cn('message', {
        my: messageIsMine,
        'with-ai-translate': enableTranslate,
      })}
    >
      <div className={cn('info', { 'with-ai-answer': enableQuickAnswer })}>
        <span className="sender">{senderName}</span>
        <span className="sent-at">
          {getSentTime(lastMessage.date_sent * 1000)}
        </span>
      </div>
      {messages.map((message) => renderMessage(message, messageIsMine))}
    </div>
  )
}
