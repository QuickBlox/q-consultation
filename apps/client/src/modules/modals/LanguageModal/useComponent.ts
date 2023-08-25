import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { toggleShowModal, updateMyAccount } from '../../../actionCreators'
import {
  authMyAccountSelector,
  modalLanguageSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { createMapStateSelector } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'

const selector = createMapStateSelector({
  opened: modalLanguageSelector,
  myAccount: authMyAccountSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({ toggleShowModal, updateMyAccount })

  const { myAccount } = store
  const { i18n } = useTranslation()
  const backdrop = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState(i18n.language)
  const isOffline = useIsOffLine()

  const handleApply = () => {
    i18n.changeLanguage(language)

    if (myAccount) {
      const userData = {
        custom_data: {
          language,
        },
      }

      actions.updateMyAccount(userData)
    }
    actions.toggleShowModal({ modal: 'LanguageModal' })
  }

  const handleClose = () => {
    setLanguage(i18n.language)
    actions.toggleShowModal({ modal: 'LanguageModal' })
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      handleClose()
    }
  }

  useEffect(() => {
    setLanguage(i18n.language)
  }, [i18n.language])

  return {
    store,
    refs: { backdrop },
    data: { language, isOffline },
    handlers: {
      onBackdropClick,
      handleClose,
      handleApply,
      setLanguage,
    },
  }
})
