import { i18n } from 'i18next'
import { format, parseISO, formatRelative, isValid, parse } from 'date-fns'

import { getLocale, dayPickerLocale } from './locales'

export const localizedFormat = (
  date: Date | number | string | undefined,
  pattern: Dictionary<string>,
) => {
  const currentLocale = getLocale()
  const currentFormat = pattern[currentLocale]
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const locale = dayPickerLocale[currentLocale]

  return parsedDate ? format(parsedDate, currentFormat, { locale }) : ''
}

export const formatDateMessage = (i18next: i18n, date: string) => {
  const formatRelativeLocale: Dictionary<string | undefined> = {
    lastWeek: 'PPP',
    yesterday: `'${i18next.t('Yesterday')}'`,
    today: `'${i18next.t('Today')}'`,
    tomorrow: 'PPP',
    nextWeek: 'PPP',
    other: 'PPP',
  }

  return formatRelative(parseISO(date), new Date(), {
    locale: dayPickerLocale[i18next.language] && {
      ...dayPickerLocale[i18next.language],
      formatRelative: (key: string) => formatRelativeLocale[key],
    },
  })
}

export const getSentTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`
}

export const isMatchFormat = (
  dateString: string,
  dateFormat: string,
  language: string,
) => {
  const localeDate = {
    locale: dayPickerLocale[language],
  }
  const parsedDate = parse(dateString, dateFormat, new Date(), localeDate)

  return (
    isValid(parsedDate) &&
    dateString === format(parsedDate, dateFormat, localeDate)
  )
}
