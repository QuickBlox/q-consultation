import { i18n } from 'i18next'
import moment, { Moment } from 'moment'

export const localizedFormat = (
  date: Date | Moment | number | string | undefined,
  format: Dictionary<string>,
) => {
  const currentFormat = format[moment.locale()]

  return date ? moment(date).format(currentFormat) : ''
}

export const formatDateMessage = (i18next: i18n, date: string) => {
  moment.updateLocale(i18next.language, {
    calendar: {
      sameDay: `[${i18next.t('Today')}]`,
      lastDay: `[${i18next.t('Yesterday')}]`,
      lastWeek: 'LL',
      sameElse: 'LL',
    },
  })

  return moment(date).calendar()
}

export const getSentTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`
}
