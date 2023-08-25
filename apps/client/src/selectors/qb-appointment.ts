import moment from 'moment'
import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { denormalize } from '../utils/normalize'
import { authMyAccountIdSelector } from './auth'
import { callAppointmentIdSelector } from './qb-webrtc'

export const appointmentSelector = (state: StoreState) => state.appointment

export const appointmentLoadingSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.loading,
)

export const appointmentEntriesSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.entries,
)

export const appointmentErrorSelector = createSelector(
  appointmentSelector,
  (appointment) => appointment.error,
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

export const appointmentListActiveSelector = createSelector(
  [appointmentListSelector, authMyAccountIdSelector],
  (appointmentList, myAccountId) =>
    appointmentList.filter(
      ({ client_id, date_end }) => !date_end && client_id === myAccountId,
    ),
)

export const appointmentCallSelector = createSelector(
  [callAppointmentIdSelector, appointmentEntriesSelector],
  (appointmentId, appointments) =>
    appointmentId ? appointments[appointmentId] : undefined,
)

export const createAppointmentByIdSelector = (
  appointmentId?: QBAppointment['_id'],
) =>
  createSelector(appointmentEntriesSelector, (appointments) =>
    appointmentId ? appointments[appointmentId] : undefined,
  )

export const createAppointmentWaitingByProviderIdSelector = (
  providerId?: QBUser['id'],
) =>
  createSelector(
    [appointmentListSelector, authMyAccountIdSelector],
    (appointmentList, myAccountId) =>
      providerId
        ? appointmentList.find(
            ({ client_id, provider_id, date_end, date_start }) =>
              !date_end &&
              !date_start &&
              client_id === myAccountId &&
              provider_id === providerId,
          )
        : undefined,
  )

export const createAppointmentListHistoryByDateRangeSelector = (
  dateRange: Partial<DateRange>,
) =>
  createSelector(
    [appointmentListSelector, authMyAccountIdSelector],
    (appointmentList, myAccountId) =>
      appointmentList
        .filter(({ client_id, date_end }) => {
          const isMyAppointment = client_id === myAccountId
          const isAfter = dateRange.from
            ? date_end && moment(date_end).isSameOrAfter(dateRange.from, 'day')
            : true
          const isBefore = dateRange.to
            ? date_end && moment(date_end).isSameOrBefore(dateRange.to, 'day')
            : true
          const isBetween = isAfter && isBefore

          return isMyAppointment && date_end && isBetween
        })
        .sort(
          (prev, next) =>
            moment(next.date_end).valueOf() - moment(prev.date_end).valueOf(),
        ),
  )

export const appointmentHasMoreSelector = createSelector(
  [appointmentListSelector, appointmentLimitSelector, appointmentSkipSelector],
  (appointmentList, limit, skip) => appointmentList.length >= limit + skip,
)
