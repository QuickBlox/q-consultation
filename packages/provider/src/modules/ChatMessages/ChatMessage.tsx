import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { markMessageRead as markMessageReadAction } from '../../actionCreators'

import MessageBody from './MessageBody'

interface ChatMessageProps {
  chatOpen?: boolean
  myAccountId: QBUser['id']
  message: QBChatMessage
  users: Dictionary<QBUser>
  markMessageRead: typeof markMessageReadAction
}

function getSentTime(timestamp: number) {
  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`
}

export default function ChatMessage(props: ChatMessageProps) {
  const { myAccountId, message, users, markMessageRead, chatOpen } = props
  const { t } = useTranslation()

  const messageIsMine = message.sender_id === myAccountId
  const messageIsRead = messageIsMine
    ? true
    : typeof message.read_ids !== 'undefined' &&
      message.read_ids !== null &&
      message.read_ids.includes(myAccountId)

  useEffect(() => {
    if (chatOpen && !messageIsRead) {
      markMessageRead({
        myAccountId,
        dialogId: message.chat_dialog_id,
        messageId: message._id,
        userId: message.sender_id,
      })
    }
  }, [chatOpen, messageIsRead, message])

  const sender = messageIsMine
    ? { full_name: t('You') }
    : users[message.sender_id]
  let senderName = null

  if (sender) {
    senderName =
      'login' in sender
        ? sender.full_name || sender.login || sender.email
        : sender.full_name
  } else {
    senderName = message.sender_id
  }

  return (
    <div className={cn('message', { my: messageIsMine })}>
      <div className="info">
        <span className="sender">{senderName}</span>
        <span className="sent-at">{getSentTime(message.date_sent * 1000)}</span>
      </div>
      <MessageBody message={message} />
    </div>
  )
}
