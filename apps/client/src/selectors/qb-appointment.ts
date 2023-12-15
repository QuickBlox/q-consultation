import { createSelector } from 'reselect'
import {
  isSameDay,
  isAfter,
  parseISO,
  isBefore,
  getTime,
  startOfDay,
} from 'date-fns'
import { QBUser, QBAppointment } from '@qc/quickblox'

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
            ({ client_id, provider_id, date_end }) =>
              !date_end &&
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

          if (!(date_end && dateRange.from && dateRange.to)) {
            return isMyAppointment && date_end
          }

          const fromIsSameDay = isSameDay(parseISO(date_end), dateRange.from)
          const fromIsAfter = isAfter(
            startOfDay(parseISO(date_end)),
            startOfDay(dateRange.from),
          )
          const toIsSameDay = isSameDay(parseISO(date_end), dateRange.to)
          const toIsAfter = isBefore(
            startOfDay(parseISO(date_end)),
            startOfDay(dateRange.to),
          )

          const dateEndIsEqualOrAfter = fromIsSameDay || fromIsAfter
          const dateEndIsEqualOrBefore = toIsSameDay || toIsAfter
          const isBetween = dateEndIsEqualOrAfter && dateEndIsEqualOrBefore

          return isMyAppointment && date_end && isBetween
        })
        .sort((prev, next) =>
          next.date_end && prev.date_end
            ? getTime(parseISO(next.date_end)) -
              getTime(parseISO(prev.date_end))
            : 0,
        ),
  )

export const appointmentHasMoreSelector = createSelector(
  [appointmentListSelector, appointmentLimitSelector, appointmentSkipSelector],
  (appointmentList, limit, skip) => appointmentList.length >= limit + skip,
)
