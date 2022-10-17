import localeOptions from '../constants/localeOptions'

export const getLocale = () => {
  const localLocale = localStorage.getItem('lang')

  if (localLocale) return localLocale

  const [locale] = window.navigator.language.split('-')

  return localeOptions.some(({ value }) => value === locale)
    ? locale
    : DEFAULT_LANGUAGE
}
