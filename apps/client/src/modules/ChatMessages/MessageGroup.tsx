import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { QBChatMessage, QBUser } from '@qc/quickblox'

import { markMessageRead as markMessageReadAction } from '../../actionCreators'
import { useMobileLayout } from '../../hooks'
import { getSentTime } from '../../utils/calendar'

interface MessageGroupProps {
  myAccountId: QBUser['id']
  messages: QBChatMessage[]
  users: Dictionary<QBUser>
  chatOpen?: boolean
  markMessageRead: typeof markMessageReadAction
  renderMessage: (message: QBChatMessage, isMine: boolean) => JSX.Element
}

export default function MessageGroup(props: MessageGroupProps) {
  const {
    myAccountId,
    messages,
    markMessageRead,
    users,
    chatOpen,
    renderMessage,
  } = props
  const { t } = useTranslation()
  const RESOLUTION_XS = useMobileLayout()
  const lastMessage = messages[messages.length - 1]
  const messageIsMine = lastMessage.sender_id === myAccountId
  const messageIsRead = messageIsMine
    ? true
    : typeof lastMessage.read_ids !== 'undefined' &&
      lastMessage.read_ids !== null &&
      lastMessage.read_ids.includes(myAccountId)

  useEffect(() => {
    if (RESOLUTION_XS ? chatOpen && !messageIsRead : !messageIsRead) {
      markMessageRead({
        myAccountId,
        dialogId: lastMessage.chat_dialog_id,
        messageId: lastMessage._id,
        userId: lastMessage.sender_id,
      })
    }
  }, [RESOLUTION_XS, chatOpen, messageIsRead, lastMessage])

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
        'with-ai-translate': AI_TRANSLATE,
      })}
    >
      <div className="info">
        <span className="sender">{senderName}</span>
        <span className="sent-at">
          {getSentTime(lastMessage.date_sent * 1000)}
        </span>
      </div>
      {messages.map((message) => renderMessage(message, messageIsMine))}
    </div>
  )
}
