import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { startOfDay, isAfter, parseISO, isBefore, isSameDay } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { DATE_INPUT_FORMAT } from '@qc/template/dateFormat'

import { QBAppointment } from '@qc/quickblox/dist/types'
import { listUsers, getUserAvatar } from '../../actionCreators'
import { createUseComponent, useActions, useForm } from '../../hooks'
import {
  avatarEntriesSelector,
  usersEntriesSelector,
  usersLoadingSelector,
  usersNotFoundSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import { isMatchFormat } from '../../utils/calendar'

interface FormValues {
  from?: Date | string
  to?: Date | string
}
interface FormErrors extends Partial<DictionaryByKey<FormValues, string>> {
  common?: string
}

export interface AppointmentRegisterProps {
  title: string
  fromDate?: Date
  toDate?: Date
  loading?: boolean
  appointmentList: QBAppointment[]
  loadMoreAppointments?: VoidFunction
  type: 'history' | 'upcoming'
  onBack?: VoidFunction
  onChangeDate: (dateRange: Partial<DateRange>) => void
  onSelectAppointment: (appointmentId: QBAppointment['_id']) => void
}

const selector = createMapStateSelector({
  userEntries: usersEntriesSelector,
  usersLoading: usersLoadingSelector,
  usersNotFound: usersNotFoundSelector,
  avatarEntries: avatarEntriesSelector,
})

export default createUseComponent((props: AppointmentRegisterProps) => {
  const { fromDate, toDate, appointmentList, type, onChangeDate } = props
  const store = useSelector(selector)
  const actions = useActions({ listUsers, getUserAvatar })
  const isOffline = useIsOffLine()
  const { i18n } = useTranslation()

  const { userEntries, usersLoading, usersNotFound, avatarEntries } = store

  const presentDay = new Date()

  const disabledDays = (day: Date | string) => {
    if (isOffline) return true

    if (type === 'history')
      return isAfter(
        startOfDay(day instanceof Date ? day : parseISO(day)),
        startOfDay(presentDay),
      )

    if (type === 'upcoming')
      return isBefore(
        startOfDay(day instanceof Date ? day : parseISO(day)),
        startOfDay(presentDay),
      )

    return false
  }

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}
    // @ts-ignore
    const dateFormat: string = DATE_INPUT_FORMAT[i18n.language]

    if (values.from) {
      if (
        !(
          values.from instanceof Date ||
          isMatchFormat(values.from, dateFormat, i18n.language)
        )
      ) {
        errors.from = 'INVALID_FORMAT'
      } else if (values.from && disabledDays(values.from)) {
        errors.from = 'INVALID_DATE'
      }
    }

    if (values.to) {
      if (
        !(
          values.to instanceof Date ||
          isMatchFormat(values.to, dateFormat, i18n.language)
        )
      ) {
        errors.to = 'INVALID_FORMAT'
      } else if (values.to && disabledDays(values.to)) {
        errors.to = 'INVALID_DATE'
      }
    }

    if (
      !errors.from &&
      !errors.to &&
      values.from &&
      values.to &&
      isAfter(
        startOfDay(
          values.from instanceof Date ? values.from : parseISO(values.from),
        ),
        startOfDay(values.to instanceof Date ? values.to : parseISO(values.to)),
      )
    ) {
      errors.common = 'TO_LARGER_FROM'
    }

    return errors
  }

  const dateFilterForm = useForm<FormValues, FormErrors>({
    initialValues: {
      from: fromDate,
      to: toDate,
    },
    validate: handleValidate,
  })

  const handleChangeDate =
    (field: 'from' | 'to') => (selectedDate?: Date, inputValue?: string) => {
      const currentDateRange = {
        from: fromDate,
        to: toDate,
        [field]: selectedDate,
      }

      const isDatesDifferentInDays = (first?: Date, second?: Date) => {
        return (
          (first && second ? isSameDay(first, second) : true) &&
          first === second
        )
      }

      dateFilterForm.setFieldValue(field, selectedDate || inputValue)

      if (
        !isDatesDifferentInDays(fromDate, currentDateRange.from) ||
        !isDatesDifferentInDays(toDate, currentDateRange.to)
      ) {
        onChangeDate(currentDateRange)
      }
    }

  useEffect(() => {
    if (!usersLoading && appointmentList.length) {
      const userIds = Object.keys(userEntries)
      const ocupantsIds = appointmentList.reduce<
        QBAppointment['provider_id'][]
      >(
        (list, { provider_id }) =>
          list.includes(provider_id) ||
          usersNotFound.includes(provider_id) ||
          userIds.includes(provider_id.toString())
            ? list
            : list.concat(provider_id),
        [],
      )

      if (ocupantsIds.length) {
        actions.listUsers({
          filter: {
            field: 'id',
            param: 'in',
            value: ocupantsIds,
          },
          per_page: ocupantsIds.length,
        })
      }
    }
  }, [appointmentList, userEntries, usersLoading, usersNotFound])

  useEffect(() => {
    if (!usersLoading && appointmentList.length) {
      const userIds = Object.keys(avatarEntries)
      const ocupantsIds = appointmentList.reduce<
        QBAppointment['provider_id'][]
      >(
        (list, { provider_id }) =>
          list.includes(provider_id) || userIds.includes(provider_id?.toString())
            ? list
            : list.concat(provider_id),
        [],
      )

      if (ocupantsIds.length) {
        ocupantsIds.forEach((userId) => {
          actions.getUserAvatar(userId)
        })
      }
    }
  }, [appointmentList, usersLoading])

  return {
    store,
    actions,
    forms: {
      dateFilterForm,
    },
    data: {
      disabledDays,
    },
    handlers: {
      handleChangeDate,
    },
  }
})
