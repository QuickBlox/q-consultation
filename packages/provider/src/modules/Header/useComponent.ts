import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { toggleShowModal, updateMyAccount } from '../../actionCreators'
import localeOptions from '../../constants/localeOptions'
import { PROFILE_ROUTE, HISTORY_ROUTE } from '../../constants/routes'
import { createUseComponent, useActions } from '../../hooks'
import { authMyAccountSelector, callIsActiveSelector } from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

const selector = createMapStateSelector({
  myAccount: authMyAccountSelector,
  onCall: callIsActiveSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({ toggleShowModal, updateMyAccount })
  const isOffline = useIsOffLine()

  const { myAccount } = store
  const { t, i18n } = useTranslation()
  const [menuSidebarOpen, setMenuSidebarOpen] = useState(false)
  const [language, setLanguage] = useState(i18n.language)

  const selectedLanguageOption = localeOptions.find(
    ({ value }) => language === value,
  )

  const handleSelectLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)

    if (myAccount) {
      const userData = {
        custom_data: {
          language: lang,
        },
      }

      actions.updateMyAccount(userData)
    }
  }

  const toggleMenuSidebarOpen = () => setMenuSidebarOpen(!menuSidebarOpen)
  const toggleLanguageModal = () =>
    actions.toggleShowModal({ modal: 'LanguageModal' })
  const toggleShareLinkModal = () =>
    actions.toggleShowModal({ modal: 'ShareLinkModal' })
  const toggleLogoutModal = () =>
    actions.toggleShowModal({ modal: 'LogoutModal' })
  const toggleCreateAppointmentModal = () =>
    actions.toggleShowModal({ modal: 'CreateAppointmentModal' })

  const menuOptions = [
    { label: t('History'), path: HISTORY_ROUTE },
    { label: t('Profile'), path: PROFILE_ROUTE },
    { divider: true },
    { label: t('Logout'), onClick: toggleLogoutModal },
  ]

  const menuMobileOptions = [
    { label: t('CreateAppointment'), onClick: toggleCreateAppointmentModal },
    { label: t('ShareLink'), onClick: toggleShareLinkModal, hide: !CLIENT_APP_URL },
    { divider: true, hide: !CLIENT_APP_URL },
    { label: t('History'), path: HISTORY_ROUTE },
    { label: t('Profile'), path: PROFILE_ROUTE },
    { label: t('Language'), onClick: toggleLanguageModal },
    { divider: true },
    { label: t('Logout'), onClick: toggleLogoutModal },
  ].filter(({ hide }) => !hide)

  useEffect(() => {
    setLanguage(i18n.language)
  }, [i18n.language])

  return {
    store,
    data: {
      language,
      menuOptions,
      menuMobileOptions,
      menuSidebarOpen,
      isOffline,
    },
    handlers: {
      toggleMenuSidebarOpen,
      toggleCreateAppointmentModal,
      toggleLanguageModal,
      toggleShareLinkModal,
      toggleLogoutModal,
      handleSelectLanguage,
      selectedLanguageOption,
    },
  }
})
