import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import moment from 'moment'
import { createUseComponent, useActions, useMobileLayout } from '../../../hooks'
import { getRecords, toggleShowModal } from '../../../actionCreators'
import {
  authMyAccountSelector,
  createAppointmentByIdSelector,
  createRecordsByAppointmentIdSelector,
  createUsersClientByAppointmentIdSelector,
  modalAppointmentChatSelector,
  modalAppointmentIdSelector,
} from '../../../selectors'
import { parseUser } from '../../../utils/user'
import { combineSelectors } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'
import { FULL_DATE_SHORT_FORMAT } from '../../../constants/dateFormat'
import { ABOUT_TAB, AppointmentDetailsTabs } from '../../../constants/tabs'
import { localizedFormat } from '../../../utils/calendar'

export interface AppointmentDetailsModalProps {
  onClose?: () => void
}

type AccordeonNamesType =
  | 'client-info'
  | 'consultation-topic'
  | 'video-records'
  | 'notes'
  | 'conclusion'

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    myAccount: authMyAccountSelector,
    opened: modalAppointmentChatSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
    user: createUsersClientByAppointmentIdSelector(appointmentId),
    records: createRecordsByAppointmentIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: AppointmentDetailsModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const { appointment, user } = store
  const actions = useActions({
    toggleShowModal,
    getRecords,
  })
  const isOffline = useIsOffLine()

  const backdrop = useRef<HTMLDivElement>(null)
  const RESOLUTION_XS = useMobileLayout()
  const [accordeonActive, setAccordeonActive] = useState<AccordeonNamesType>()
  const [activeTab, setActiveTab] = useState<AppointmentDetailsTabs>(ABOUT_TAB)

  const { t } = useTranslation()

  const currentUser = user && parseUser(user)
  const userName =
    currentUser?.full_name ||
    currentUser?.login ||
    currentUser?.phone ||
    currentUser?.email ||
    t('Unknown')

  const localDate =
    appointment &&
    localizedFormat(
      moment(
        appointment.date_end ||
          appointment.date_start ||
          appointment.updated_at * 1000,
      ),
      FULL_DATE_SHORT_FORMAT,
    )

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'AppointmentDetailsModal' })

    if (onClose) {
      onClose()
    }
  }

  const handleOpenRecordModal = (recordId: QBRecord['_id']) => {
    actions.toggleShowModal({ modal: 'RecordModal', recordId })
  }

  const toggleAccordeon = (name: AccordeonNamesType) => {
    setAccordeonActive(name === accordeonActive ? undefined : name)
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const startEditingNotes = (e: ReactMouseEvent<SVGElement>) => {
    e.stopPropagation()

    if (appointment) {
      actions.toggleShowModal({
        modal: 'EditNotesModal',
        appointmentId: appointment._id,
      })
    }
  }

  useEffect(() => {
    if (appointment?._id) {
      actions.getRecords(appointment._id)
    }
  }, [appointment?._id])

  return {
    store,
    refs: { backdrop },
    data: {
      localDate,
      accordeonActive,
      userName,
      currentUser,
      activeTab,
      RESOLUTION_XS,
      isOffline,
    },
    handlers: {
      toggleAccordeon,
      onBackdropClick,
      onCancelClick,
      setActiveTab,
      startEditingNotes,
      handleOpenRecordModal,
    },
  }
})
