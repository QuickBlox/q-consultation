import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { createUseComponent, useActions, useMobileLayout } from '../../../hooks'
import { toggleShowModal } from '../../../actionCreators'
import {
  avatarEntriesSelector,
  createUsersByIdSelector,
  modalProviderBiographySelector,
  modalProviderIdSelector,
} from '../../../selectors'
import { parseUser } from '../../../utils/user'
import { combineSelectors } from '../../../utils/selectors'

export interface ProviderBiographyModalProps {
  onClose?: () => void
}

const selector = combineSelectors(
  {
    providerId: modalProviderIdSelector,
    opened: modalProviderBiographySelector,
    avatarEntries: avatarEntriesSelector,
  },
  ({ providerId }) => ({
    user: createUsersByIdSelector(providerId),
  }),
)

export default createUseComponent((props: ProviderBiographyModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    toggleShowModal,
  })
  const { user, avatarEntries } = store
  const userAvatar = user?.id ? avatarEntries[user.id] : undefined

  const backdrop = useRef<HTMLDivElement>(null)
  const RESOLUTION_XS = useMobileLayout()

  const { t } = useTranslation()

  const currentUser = user && parseUser(user)
  const userName =
    currentUser?.full_name ||
    currentUser?.login ||
    currentUser?.phone ||
    currentUser?.email ||
    t('Unknown')

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'ProviderBiographyModal' })

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
    refs: { backdrop },
    data: { userName, currentUser, RESOLUTION_XS, userAvatar },
    handlers: {
      onBackdropClick,
      onCancelClick,
    },
  }
})
