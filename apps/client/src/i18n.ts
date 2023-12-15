import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCountries from 'react-phone-number-input/locale/en.json'
import uaCountries from 'react-phone-number-input/locale/ua.json'
import esCountries from 'react-phone-number-input/locale/es.json'

import translations from '@qc/template/translations'
import { getLocale } from './utils/locales'

const currentLocale = getLocale()

document.documentElement.lang = currentLocale

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translations.en,
      countries: enCountries,
    },
    es: {
      translation: translations.es,
      countries: esCountries,
    },
    uk: {
      translation: translations.uk,
      countries: uaCountries,
    },
  },
  debug: __DEV__,
  supportedLngs: ['en', 'uk', 'es'],
  lng: currentLocale,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: 'translation',
  ns: ['translation'],
  load: 'languageOnly',
  interpolation: {
    escapeValue: false,
    skipOnVariables: false,
  },
  returnNull: false,
})

i18n.on('languageChanged', (lang) => {
  document.documentElement.lang = lang
  localStorage.setItem('lang', lang)
})

export default i18n
