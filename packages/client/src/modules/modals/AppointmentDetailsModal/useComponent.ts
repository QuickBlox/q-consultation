import { MouseEvent as ReactMouseEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { createUseComponent, useActions, useMobileLayout } from '../../../hooks'
import { toggleShowModal } from '../../../actionCreators'
import {
  authMyAccountSelector,
  createAppointmentByIdSelector,
  createUsersProviderByAppointmentIdSelector,
  modalAppointmentChatSelector,
  modalAppointmentIdSelector,
} from '../../../selectors'
import { parseUser } from '../../../utils/user'
import { combineSelectors } from '../../../utils/selectors'
import { createPdf } from '../../../utils/pdfFile'
import useIsOffLine from '../../../hooks/useIsOffLine'

export interface AppointmentDetailsModalProps {
  onClose?: () => void
}

type TabsList = 'about' | 'chat'

type AccordeonNamesType = 'consultation-topic' | 'conclusion'

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    myAccount: authMyAccountSelector,
    opened: modalAppointmentChatSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
    user: createUsersProviderByAppointmentIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: AppointmentDetailsModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const { user, appointment } = store
  const actions = useActions({
    toggleShowModal,
  })
  const isOffline = useIsOffLine()

  const backdrop = useRef<HTMLDivElement>(null)
  const RESOLUTION_XS = useMobileLayout()
  const [accordeonActive, setAccordeonActive] = useState<AccordeonNamesType>()
  const [activeTab, setActiveTab] = useState<TabsList>('about')

  const { t } = useTranslation()

  const currentUser = user && parseUser(user)
  const userName =
    currentUser?.full_name ||
    currentUser?.login ||
    currentUser?.phone ||
    currentUser?.email ||
    t('Unknown')

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'AppointmentDetailsModal' })

    if (onClose) {
      onClose()
    }
  }

  const toggleAccordeon = (name: AccordeonNamesType) => {
    setAccordeonActive(name === accordeonActive ? undefined : name)
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const onDownloadConclusion = (e: ReactMouseEvent<SVGElement>) => {
    e.stopPropagation()

    if (appointment && !isOffline) {
      createPdf({
        lang: appointment?.language,
        title: 'Conclusion',
        author: user?.full_name,
        content: appointment.conclusion,
      }).download('Conclusion.pdf')
    }
  }

  return {
    store,
    refs: { backdrop },
    data: {
      accordeonActive,
      userName,
      currentUser,
      activeTab,
      RESOLUTION_XS,
    },
    handlers: {
      toggleAccordeon,
      onBackdropClick,
      onCancelClick,
      setActiveTab,
      onDownloadConclusion,
    },
  }
})
