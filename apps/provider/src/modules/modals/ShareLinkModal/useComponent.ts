import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { generatePath } from 'react-router-dom'

import { createUseComponent, useActions } from '../../../hooks'
import { toggleShowModal, showNotification } from '../../../actionCreators'
import {
  authMyAccountSelector,
  modalShareLinkSelector,
} from '../../../selectors'
import { PROVIDERS_CLIENT_ROUTE } from '../../../constants/routes'
import { createMapStateSelector } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'

export interface ShareLinkModalProps {
  onClose?: () => void
}

const selector = createMapStateSelector({
  myAccount: authMyAccountSelector,
  opened: modalShareLinkSelector,
})

export default createUseComponent((props: ShareLinkModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    toggleShowModal,
    showNotification,
  })
  const { myAccount } = store
  const backdrop = useRef<HTMLDivElement>(null)
  const isOffline = useIsOffLine()
  const { t } = useTranslation()

  const url = myAccount?.id
    ? generatePath(PROVIDERS_CLIENT_ROUTE, {
        providerId: myAccount?.id?.toString(),
      })
    : CLIENT_APP_URL

  const onCopyButtonClick = async () => {
    await navigator.clipboard.writeText(url)
    onCancelClick()
    actions.showNotification({
      duration: 3 * SECOND,
      id: Date.now().toString(),
      message: t('LinkCopied'),
      position: 'top-center',
      type: 'cancel',
    })
  }

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'ShareLinkModal' })

    if (onClose) {
      onClose()
    }
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  return {
    store,
    actions,
    refs: { backdrop },
    data: { isOffline, url },
    handlers: {
      onCopyButtonClick,
      onCancelClick,
      onBackdropClick,
    },
  }
})
