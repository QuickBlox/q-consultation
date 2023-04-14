import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { markMessageRead as markMessageReadAction } from '../../actionCreators'
import { getSentTime } from '../../utils/calendar'

import MessageBody from './MessageBody'

interface ChatMessageProps {
  chatOpen?: boolean
  myAccountId: QBUser['id']
  messages: QBChatMessage[]
  users: Dictionary<QBUser>
  markMessageRead: typeof markMessageReadAction
}

export default function ChatMessage(props: ChatMessageProps) {
  const { myAccountId, messages, users, markMessageRead, chatOpen } = props
  const lastMessage = messages.at(-1)!
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
    <div className={cn('message', { my: messageIsMine })}>
      <div className="info">
        <span className="sender">{senderName}</span>
        <span className="sent-at">{getSentTime(lastMessage.date_sent * 1000)}</span>
      </div>
      {messages.map((message) => (
        <MessageBody key={message._id} message={message} />
      ))}
    </div>
  )
}
