import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { denormalize } from '../utils/normalize'
import { modalAppointmentUserIdSelector } from './modal'
import { createAppointmentByIdSelector } from './qb-appointment'
import { callOpponentIdSelector } from './qb-webrtc'

export const usersSelector = (state: StoreState) => state.users

export const usersEntriesSelector = createSelector(
  usersSelector,
  (users) => users.entries,
)

export const usersListSelector = createSelector(usersEntriesSelector, (users) =>
  denormalize(users),
)
export const usersLoadingSelector = createSelector(
  usersSelector,
  (users) => users.loading,
)

export const usersErrorSelector = createSelector(
  usersSelector,
  (users) => users.error,
)

export const usersTotalEntriesSelector = createSelector(
  usersSelector,
  (users) => users.total_entries,
)

export const usersPerPageSelector = createSelector(
  usersSelector,
  (users) => users.per_page,
)

export const usersCurrentPageSelector = createSelector(
  usersSelector,
  (users) => users.current_page,
)

export const usersHasMoreSelector = createSelector(
  usersTotalEntriesSelector,
  usersPerPageSelector,
  usersCurrentPageSelector,
  (totalEntries, perPage, currentPage) => totalEntries >= perPage * currentPage,
)

export const usersSelectedModalAppointmentSelector = createSelector(
  usersEntriesSelector,
  modalAppointmentUserIdSelector,
  (users, appointmentUserId) =>
    appointmentUserId ? users[appointmentUserId] : undefined,
)

export const usersCallOpponentSelector = createSelector(
  [usersEntriesSelector, callOpponentIdSelector],
  (users, opponentId) => (opponentId ? users[opponentId] : undefined),
)

export const createUsersClientByAppointmentIdSelector = (
  appointmentId?: QBAppointment['_id'],
) =>
  createSelector(
    [createAppointmentByIdSelector(appointmentId), usersEntriesSelector],
    (appointment, users) =>
      appointment?.client_id ? users[appointment.client_id] : undefined,
  )

export const createUsersByIdSelector = (userId?: QBUser['id']) =>
  createSelector(usersEntriesSelector, (usersEntries) =>
    userId ? usersEntries[userId] : undefined,
  )
