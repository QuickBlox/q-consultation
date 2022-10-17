import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
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
  createUsersClientByAppointmentIdSelector,
  modalAppointmentChatSelector,
  modalAppointmentIdSelector,
  recorderDataSelector,
} from '../../../selectors'
import { parseUser } from '../../../utils/user'
import { combineSelectors } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'
import { TIME_FORMAT } from '../../../constants/dateFormat'
import { ABOUT_TAB, AppointmentDetailsTabs } from '../../../constants/tabs'

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
    records: recorderDataSelector,
    opened: modalAppointmentChatSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
    user: createUsersClientByAppointmentIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: AppointmentDetailsModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const { appointment, user, records } = store
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

  const timeRange = useMemo(() => {
    if (
      appointment &&
      appointment.date_start &&
      appointment.date_end &&
      moment(appointment.date_end).isAfter(appointment.date_start)
    ) {
      return `${moment(appointment.date_start).format(TIME_FORMAT)} - ${moment(
        appointment.date_end,
      ).format(TIME_FORMAT)}`
    }

    return undefined
  }, [appointment])

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
    if (appointment) {
      const missingRecordsIds = appointment?.records?.filter(
        (fileId) => !records[fileId],
      )

      if (missingRecordsIds?.length) {
        actions.getRecords(missingRecordsIds)
      }
    }
  }, [appointment, records])

  return {
    store,
    refs: { backdrop },
    data: {
      timeRange,
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
    },
  }
})
