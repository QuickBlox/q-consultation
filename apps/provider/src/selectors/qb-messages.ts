import { createSelector } from 'reselect'
import moment from 'moment'

import { StoreState } from '../reducers'
import { denormalize } from '../utils/normalize'

export const messagesSelector = (state: StoreState) => state.messages

export const messagesLoadingSelector = createSelector(
  messagesSelector,
  (messages) => messages.loading,
)

export const messagesDialogsSelector = createSelector(
  messagesSelector,
  (messages) => messages.dialogs,
)

export const messagesLoadMessageIdSelector = createSelector(
  messagesSelector,
  (messages) => messages.loadMessageId,
)

export const createMessagesDialogByIdSelector = (
  dialogId?: QBChatDialog['_id'],
) =>
  createSelector(messagesDialogsSelector, (dialogs) =>
    dialogId ? dialogs[dialogId] : undefined,
  )

export const createMessagesEntriesByDialogIdSelector = (
  dialogId?: QBChatDialog['_id'],
) =>
  createSelector(
    createMessagesDialogByIdSelector(dialogId),
    (dialog) => dialog?.entries || {},
  )

export const createMessagesListByDialogIdSelector = (
  dialogId?: QBChatDialog['_id'],
) =>
  createSelector(createMessagesEntriesByDialogIdSelector(dialogId), (entries) =>
    denormalize(entries).sort(
      (a, b) => moment(a.created_at).valueOf() - moment(b.created_at).valueOf(),
    ),
  )

export const createMessagesLimitByDialogIdSelector = (
  dialogId?: QBChatDialog['_id'],
) =>
  createSelector(
    createMessagesDialogByIdSelector(dialogId),
    (dialog) => dialog?.limit || 0,
  )

export const createMessagesSkipByDialogIdSelector = (
  dialogId?: QBChatDialog['_id'],
) =>
  createSelector(
    createMessagesDialogByIdSelector(dialogId),
    (dialog) => dialog?.skip || 0,
  )

export const createMessagesHasMoreByDialogIdSelector = (
  dialogId?: QBChatDialog['_id'],
) =>
  createSelector(
    [
      createMessagesListByDialogIdSelector(dialogId),
      createMessagesLimitByDialogIdSelector(dialogId),
      createMessagesSkipByDialogIdSelector(dialogId),
    ],
    (messagesList, limit, skip) => messagesList.length >= limit + skip,
  )
