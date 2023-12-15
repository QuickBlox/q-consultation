import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { QBChatDialog, QBChatMessage } from '@qc/quickblox'
import {
  getMessages,
  markMessageRead,
  getQuickAnswer,
  getQuickAnswerCancel,
  getTranslate,
  showNotification,
} from '../../actionCreators'
import {
  authMyAccountIdSelector,
  messagesLoadingSelector,
  usersEntriesSelector,
  createMessagesListByDialogIdSelector,
  createMessagesHasMoreByDialogIdSelector,
  messagesLoadMessageIdSelector,
} from '../../selectors'
import { formatDateMessage, getSentTime } from '../../utils/calendar'
import { createUseComponent, useActions, usePrevious } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import { translateSelector } from '../../selectors/translate'

export interface ChatMessagesProps {
  dialogId?: QBChatDialog['_id']
  chatOpen?: boolean
  setInputValue?: (value: string) => void
}

const createSelector = (dialogId?: QBChatDialog['_id']) =>
  createMapStateSelector({
    myAccountId: authMyAccountIdSelector,
    loading: messagesLoadingSelector,
    users: usersEntriesSelector,
    loadMessageId: messagesLoadMessageIdSelector,
    translate: translateSelector,
    hasMore: createMessagesHasMoreByDialogIdSelector(dialogId),
    messages: createMessagesListByDialogIdSelector(dialogId),
  })

const PER_PAGE = 30

export default createUseComponent((props: ChatMessagesProps) => {
  const { dialogId } = props
  const selector = createSelector(dialogId)
  const store = useSelector(selector)
  const actions = useActions({
    getMessages,
    markMessageRead,
    showNotification,
    getTranslate,
    getQuickAnswer,
    getQuickAnswerCancel,
  })
  const { i18n } = useTranslation()
  const prevDialogId = usePrevious(dialogId) || dialogId
  const isOffline = useIsOffLine()
  const { loading, hasMore, messages } = store
  const resetScroll = dialogId !== prevDialogId

  const groupMessages: { [date: string]: Dictionary<QBChatMessage[]> } = {}

  if (dialogId) {
    let groupIndex = 0

    messages.forEach((message, index) => {
      const { created_at, date_sent, sender_id } = message
      const prevMessage = messages[index - 1]

      if (sender_id !== prevMessage?.sender_id) {
        groupIndex += 1
      }

      const date = formatDateMessage(i18n, created_at)
      const sentTime = getSentTime(date_sent * 1000)
      const groupKey = `${sentTime}-${sender_id}-${groupIndex}`

      groupMessages[date] = {
        ...(groupMessages[date] || {}),
        [groupKey]: [...(groupMessages[date]?.[groupKey] || []), message],
      }
    })
  }

  const sections = Object.keys(groupMessages).map((title) => ({
    title,
    data: groupMessages[title],
  }))

  const handleGetMessages = (skip = 0) => {
    if (dialogId && !isOffline) {
      actions.getMessages({
        dialogId,
        limit: PER_PAGE,
        skip,
      })
    }
  }

  const loadMoreMessages = () => {
    if (dialogId && hasMore && !loading) {
      handleGetMessages(messages.length)
    }
  }

  useEffect(() => {
    handleGetMessages()
  }, [dialogId, isOffline])

  useEffect(() => {
    const handleSiteFocus = () => {
      handleGetMessages()
    }

    window.addEventListener('focus', handleSiteFocus)

    return () => {
      window.removeEventListener('focus', handleSiteFocus)
    }
  }, [dialogId, isOffline])

  return {
    store,
    actions,
    data: {
      sections,
      resetScroll,
    },
    handlers: {
      loadMoreMessages,
    },
  }
})
