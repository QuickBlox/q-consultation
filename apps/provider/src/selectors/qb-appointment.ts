import moment from 'moment'
import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { denormalize } from '../utils/normalize'
import { authMyAccountIdSelector } from './auth'

export const appointmentSelector = (state: StoreState) => state.appointment

export const appointmentLoadingSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.loading,
)

export const appointmentErrorSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.error,
)

export const appointmentEntriesSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.entries,
)

export const appointmentLiveQueueSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.liveQueue,
)

export const appointmentHistorySelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.history,
)

export const appointmentLimitSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.limit,
)

export const appointmentSkipSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.skip,
)

export const appointmentListSelector = createSelector(
  appointmentEntriesSelector,
  (appointments) => denormalize(appointments),
)

export const appointmentActiveListSelector = createSelector(
  [appointmentEntriesSelector, appointmentLiveQueueSelector],
  (appointmentEntries, liveQueue) =>
    liveQueue.map((appointmentId) => appointmentEntries[appointmentId]),
)

export const createAppointmentListHistorySelector = createSelector(
  [appointmentEntriesSelector, appointmentHistorySelector],
  (appointmentEntries, history) =>
    history.map((appointmentId) => appointmentEntries[appointmentId]),
)

export const appointmentHasMoreSelector = createSelector(
  [appointmentListSelector, appointmentLimitSelector, appointmentSkipSelector],
  (appointmentList, limit, skip) => appointmentList.length >= limit + skip,
)

export const appointmentDialogIdListSelector = createSelector(
  appointmentListSelector,
  (appointmentList) =>
    appointmentList
      ?.map(({ dialog_id }) => dialog_id)
      .filter((dialogId) => dialogId),
)

export const createAppointmentByIdSelector = (
  appointmentId?: QBAppointment['_id'],
) =>
  createSelector(appointmentEntriesSelector, (appointments) =>
    appointmentId ? appointments[appointmentId] : undefined,
  )

export const createAppointmentListHistoryByClientIdSelector = (
  clientId?: QBUser['id'],
) =>
  createSelector(
    [appointmentListSelector, authMyAccountIdSelector],
    (appointmentList, myAccountId) =>
      appointmentList
        .filter(
          ({ client_id, provider_id, date_end }) =>
            client_id === clientId && provider_id === myAccountId && date_end,
        )
        .sort(
          (prev: QBAppointment, next: QBAppointment) =>
            moment(next.date_end).valueOf() - moment(prev.date_end).valueOf(),
        ),
  )
