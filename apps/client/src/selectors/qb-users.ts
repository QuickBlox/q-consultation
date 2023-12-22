import { createSelector } from 'reselect'
import omitBy from 'lodash/omitBy'
import { QBUser, QBAppointment, userHasTag } from '@qc/quickblox'

import { StoreState } from '../reducers'
import { denormalize } from '../utils/normalize'
import { createAppointmentByIdSelector } from './qb-appointment'
import { callOpponentIdSelector } from './qb-webrtc'

export const usersSelector = (state: StoreState) => state.users

export const usersEntriesSelector = createSelector(
  usersSelector,
  (users) => users.entries,
)

export const usersNotFoundSelector = createSelector(
  usersSelector,
  (users) => users.not_found,
)

export const usersSuggestionsSelector = createSelector(
  usersSelector,
  (users) => users.suggestions,
)

export const usersListSelector = createSelector(
  [usersEntriesSelector, usersNotFoundSelector],
  (userEntries, notFoundUserIds) =>
    denormalize(
      omitBy(userEntries, ({ id }) => notFoundUserIds.includes(id)),
    ).sort((user) => (userHasTag(user, 'bot') ? -1 : 0)),
)

export const usersListBySuggestionsSelector = createSelector(
  [usersEntriesSelector, usersSuggestionsSelector],
  (users, suggestions) =>
    suggestions
      .map((id) => users[id])
      .sort((user) => (userHasTag(user, 'bot') ? -1 : 0)),
)

export const usersLoadingSelector = createSelector(
  usersSelector,
  (users) => users.loading,
)

export const usersTotalEntriesSelector = createSelector(
  usersSelector,
  (users) => users.total_entries,
)

export const usersErrorSelector = createSelector(
  usersSelector,
  (users) => users.error,
)

export const usersCallOpponentSelector = createSelector(
  [usersEntriesSelector, callOpponentIdSelector],
  (users, opponentId) => (opponentId ? users[opponentId] : undefined),
)

export const usersFirstId = createSelector(
  usersListSelector,
  ([firstUser]) => firstUser?.id,
)

export const createUsersByIdSelector = (userId?: QBUser['id']) =>
  createSelector(usersEntriesSelector, (usersEntries) =>
    userId ? usersEntries[userId] : undefined,
  )

export const createUsersProviderByAppointmentIdSelector = (
  appointmentId?: QBAppointment['_id'],
) =>
  createSelector(
    [createAppointmentByIdSelector(appointmentId), usersEntriesSelector],
    (appointment, users) =>
      appointment?.provider_id ? users[appointment.provider_id] : undefined,
  )
