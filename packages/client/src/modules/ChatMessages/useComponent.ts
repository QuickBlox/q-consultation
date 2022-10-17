import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { getMessages, markMessageRead } from '../../actionCreators'
import {
  authMyAccountIdSelector,
  messagesLoadingSelector,
  usersEntriesSelector,
  createMessagesListByDialogIdSelector,
  createMessagesHasMoreByDialogIdSelector,
} from '../../selectors'
import { formatDateMessage } from '../../utils/calendar'
import { createUseComponent, useActions, usePrevious } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface ChatMessagesProps {
  dialogId?: QBChatDialog['_id']
  chatOpen?: boolean
}

const createSelector = (dialogId?: QBChatDialog['_id']) =>
  createMapStateSelector({
    myAccountId: authMyAccountIdSelector,
    loading: messagesLoadingSelector,
    users: usersEntriesSelector,
    hasMore: createMessagesHasMoreByDialogIdSelector(dialogId),
    messages: createMessagesListByDialogIdSelector(dialogId),
  })

const PER_PAGE = 30

export default createUseComponent((props: ChatMessagesProps) => {
  const { dialogId, chatOpen } = props
  const selector = createSelector(dialogId)
  const store = useSelector(selector)
  const actions = useActions({
    getMessages,
    markMessageRead,
  })
  const { i18n } = useTranslation()
  const isOffline = useIsOffLine()
  const { loading, hasMore, messages } = store
  const prevChatOpen = usePrevious(chatOpen) || chatOpen
  const resetScroll = chatOpen !== prevChatOpen

  const groupMessages = dialogId
    ? messages.reduce((res: { [date: string]: QBChatMessage[] }, msg) => {
        const dateMsg = formatDateMessage(i18n, msg.created_at)

        res[dateMsg] = [...(res[dateMsg] || []), msg]

        return res
      }, {})
    : {}

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
