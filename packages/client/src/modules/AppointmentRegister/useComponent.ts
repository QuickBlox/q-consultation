import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DayModifiers } from 'react-day-picker'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import moment from 'moment'

import { listUsers } from '../../actionCreators'
import { createUseComponent, useActions, useForm } from '../../hooks'
import {
  usersEntriesSelector,
  usersLoadingSelector,
  usersNotFoundSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

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
})

export default createUseComponent((props: AppointmentRegisterProps) => {
  const { fromDate, toDate, appointmentList, type, onChangeDate } = props
  const store = useSelector(selector)
  const actions = useActions({ listUsers })
  const isOffline = useIsOffLine()

  const { userEntries, usersLoading, usersNotFound } = store

  const presentDay = new Date()

  const disabledDays = (day: Date | string) => {
    if (isOffline) return true

    if (type === 'history') return moment(day).isAfter(presentDay, 'days')

    if (type === 'upcoming') return moment(day).isBefore(presentDay, 'days')

    return false
  }

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}

    if (values.from) {
      if (
        !(
          values.from instanceof Date ||
          moment(values.from, moment.HTML5_FMT.DATE, true).isValid()
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
          moment(values.to, moment.HTML5_FMT.DATE, true).isValid()
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
      moment(values.from).isAfter(values.to, 'days')
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
    (field: 'from' | 'to') =>
    (selectedDate: Date, modifiers: DayModifiers, input: DayPickerInput) => {
      const inputField: HTMLInputElement = input.getInput()
      const currentDateRange = {
        from: fromDate,
        to: toDate,
        [field]: selectedDate,
      }

      dateFilterForm.setFieldValue(field, selectedDate || inputField.value)

      if (
        !(
          moment(fromDate).isSame(currentDateRange.from, 'days') &&
          fromDate === currentDateRange.from
        ) ||
        !(
          moment(toDate).isSame(currentDateRange.to, 'days') &&
          toDate === currentDateRange.to
        )
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
