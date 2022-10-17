import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { parseUser } from '../utils/user'

export const authSelector = (state: StoreState) => state.auth

export const authMyAccountSelector = createSelector(
  authSelector,
  (auth) => auth.account && parseUser(auth.account),
)

export const authMyAccountIdSelector = createSelector(
  authMyAccountSelector,
  (user) => (user ? user.id : -1),
)

export const authSessionSelector = createSelector(
  authSelector,
  (auth) => auth.session,
)

export const authHasSessionSelector = createSelector(
  authSessionSelector,
  (session) => Boolean(session),
)

export const authLoadingSelector = createSelector(
  authSelector,
  (auth) => auth.loading,
)

export const authErrorSelector = createSelector(
  authSelector,
  (auth) => auth.error,
)
