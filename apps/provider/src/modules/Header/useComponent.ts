import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import localeOptions from '@qc/template/locales'

import { matchPath, useLocation, useMatch } from 'react-router-dom'
import { toggleShowModal, updateMyAccount } from '../../actionCreators'
import {
  PROFILE_ROUTE,
  HISTORY_ROUTE,
  ROOT_ROUTE,
  SELECTED_APPOINTMENT_ROUTE,
} from '../../constants/routes'
import { createUseComponent, useActions, useMobileLayout } from '../../hooks'
import { authMyAccountSelector, callIsActiveSelector } from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

type LocationState = null | Partial<{
  referrer: string
}>

const selector = createMapStateSelector({
  myAccount: authMyAccountSelector,
  onCall: callIsActiveSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({ toggleShowModal, updateMyAccount })
  const isOffline = useIsOffLine()
  const RESOLUTION_XS = useMobileLayout()

  const { myAccount } = store
  const { t, i18n } = useTranslation()
  const [menuSidebarOpen, setMenuSidebarOpen] = useState(false)
  const [language, setLanguage] = useState(i18n.language)
  const matchAppointments = useMatch(SELECTED_APPOINTMENT_ROUTE)
  const location = useLocation()
  const locationState: LocationState = location.state
  const matchQueue = matchPath(
    SELECTED_APPOINTMENT_ROUTE,
    locationState?.referrer || location.pathname,
  )

  const selectedLanguageOption = localeOptions.find(
    ({ value }) => language === value,
  )

  const handleSelectLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)

    if (myAccount) {
      const userData = {
        language: lang,
      }

      actions.updateMyAccount(userData)
    }
  }

  const addReferrerToPath = <T extends { path?: string }>(option: T) =>
    option.path
      ? {
          ...option,
          path: {
            pathname: option.path,
            state: {
              referrer: matchPath(SELECTED_APPOINTMENT_ROUTE, location.pathname)
                ? location.pathname
                : locationState?.referrer,
            },
          },
        }
      : option

  const toggleMenuSidebarOpen = () => setMenuSidebarOpen(!menuSidebarOpen)
  const toggleLanguageModal = () =>
    actions.toggleShowModal({ modal: 'LanguageModal' })
  const toggleGuestUserModal = () =>
    actions.toggleShowModal({ modal: 'GuestUserModal' })
  const toggleShareLinkModal = () =>
    actions.toggleShowModal({ modal: 'ShareLinkModal' })
  const toggleLogoutModal = () =>
    actions.toggleShowModal({ modal: 'LogoutModal' })

  const createOptions = [
    {
      label: t('GuestUser'),
      onClick: toggleGuestUserModal,
      hide: !ENABLE_GUEST_CLIENT,
    },
  ]

  const menuOptions = [
    {
      label: t('Dashboard'),
      path: matchQueue ? matchQueue.pathname : ROOT_ROUTE,
    },
    { label: t('History'), path: HISTORY_ROUTE, hide: !HAS_HISTORY },
    { label: t('Profile'), path: PROFILE_ROUTE },
    { divider: true },
    { label: t('Logout'), onClick: toggleLogoutModal },
  ].map(addReferrerToPath)

  const menuMobileOptions = [
    {
      label: t('Dashboard'),
      path: matchQueue ? matchQueue.pathname : ROOT_ROUTE,
      hide: RESOLUTION_XS,
    },
    {
      label: t('CreateGuestUser'),
      onClick: toggleGuestUserModal,
      hide: !ENABLE_GUEST_CLIENT,
    },
    { label: t('ShareLink'), onClick: toggleShareLinkModal },
    { divider: true },
    { label: t('History'), path: HISTORY_ROUTE, hide: !HAS_HISTORY },
    { label: t('Profile'), path: PROFILE_ROUTE },
    { label: t('Language'), onClick: toggleLanguageModal },
    { divider: true },
    { label: t('Logout'), onClick: toggleLogoutModal },
  ].map(addReferrerToPath)

  useEffect(() => {
    setLanguage(i18n.language)
  }, [i18n.language])

  return {
    store,
    data: {
      language,
      createOptions,
      menuOptions,
      menuMobileOptions,
      menuSidebarOpen,
      isOffline,
      matchAppointments,
    },
    handlers: {
      toggleMenuSidebarOpen,
      toggleLanguageModal,
      toggleShareLinkModal,
      toggleLogoutModal,
      handleSelectLanguage,
      selectedLanguageOption,
    },
  }
})
