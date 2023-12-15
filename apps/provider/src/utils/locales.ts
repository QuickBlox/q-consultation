import { enUS, es, uk } from 'date-fns/locale'
import locales from '@qc/template/locales'

export const dayPickerLocale: Dictionary<Locale | undefined> = {
  en: enUS,
  es,
  uk,
}

export const getLocale = () => {
  if (!HAS_CHANGE_LANGUAGE) return DEFAULT_LANGUAGE

  const localLocale = localStorage.getItem('lang')

  if (localLocale && locales.some(({ value }) => value === localLocale)) {
    return localLocale
  }

  const [locale] = window.navigator.language.split('-')

  return locales.some(({ value }) => value === locale)
    ? locale
    : DEFAULT_LANGUAGE
}
