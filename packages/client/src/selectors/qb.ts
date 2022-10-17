import { createSelector } from 'reselect'
import { StoreState } from '../reducers'

export const qbSelector = (state: StoreState) => state.qb

export const qbProviderIdSelector = createSelector(
  qbSelector,
  (qb) => qb.providerId,
)

export const qbErrorSelector = createSelector(qbSelector, (qb) => qb.error)

export const qbLoadingSelector = createSelector(qbSelector, (qb) => qb.loading)

export const qbReadySelector = createSelector(qbSelector, (qb) => qb.ready)
