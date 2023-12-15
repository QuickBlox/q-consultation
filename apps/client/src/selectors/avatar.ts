import { createSelector } from 'reselect'
import { StoreState } from '../reducers'

export const avatarSelector = (state: StoreState) => state.avatar

export const avatarEntriesSelector = createSelector(
  avatarSelector,
  (avatar) => avatar.entries,
)

export const avatarMySelector = createSelector(
  avatarSelector,
  (avatar) => avatar.myAvatar,
)
