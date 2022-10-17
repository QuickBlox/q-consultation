import { createSelector } from 'reselect'
import { StoreState } from '../reducers'

export const contentSelector = (state: StoreState) => state.content

export const contentLoadingSelector = createSelector(
  contentSelector,
  (content) => content.loading,
)

export const contentProgressSelector = createSelector(
  contentSelector,
  (content) => content.progress,
)
