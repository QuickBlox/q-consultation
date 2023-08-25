import { MouseEvent as ReactMouseEvent, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { createUseComponent, useActions } from '../../../hooks'
import { toggleShowModal } from '../../../actionCreators'
import {
  authMyAccountSelector,
  modalShareLinkSelector,
} from '../../../selectors'
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
  })
  const { myAccount } = store
  const backdrop = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [loading] = useState(false)
  const isOffline = useIsOffLine()

  const url = myAccount?.id
    ? `${CLIENT_APP_URL}/providers/${myAccount.id}`
    : CLIENT_APP_URL

  const onCopyButtonClick = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2.5 * SECOND)
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
    data: { copied, loading, isOffline, url },
    handlers: {
      onCopyButtonClick,
      onCancelClick,
      onBackdropClick,
    },
  }
})
