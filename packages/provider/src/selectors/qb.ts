import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { QBReducer } from '../reducers/qb'

export const qbSelector = (state: StoreState) => state.qb

export const qbErrorSelector = createSelector(
  qbSelector,
  (qb: QBReducer) => qb.error,
)

export const qbLoadingSelector = createSelector(
  qbSelector,
  (qb: QBReducer) => qb.loading,
)

export const qbReadySelector = createSelector(
  qbSelector,
  (qb: QBReducer) => qb.ready,
)
