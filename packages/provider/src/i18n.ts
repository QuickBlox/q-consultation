import i18n from 'i18next'
import moment from 'moment'
import { initReactI18next } from 'react-i18next'

import translations from './translations'
import { getLocale } from './utils/locales'

const currentLocale = getLocale()

document.documentElement.lang = currentLocale
moment.locale(currentLocale)

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translations.en,
    },
    ru: {
      translation: translations.ru,
    },
  },
  debug: __DEV__,
  supportedLngs: ['en', 'ru'],
  lng: currentLocale,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: 'translation',
  ns: ['translation'],
  load: 'languageOnly',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lang) => {
  document.documentElement.lang = lang
  localStorage.setItem('lang', lang)
  moment.locale(lang)
})

export default i18n
