import { createSelector } from 'reselect'
import { StoreState } from '../reducers'

export const chatSelector = (state: StoreState) => state.chat

export const chatConnectedSelector = createSelector(
  chatSelector,
  (chat) => chat.connected,
)

export const lastReceivedMessageIdSelector = createSelector(
  chatSelector,
  (chat) => chat.lastReceivedMessageId,
)
