import {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { format } from 'date-fns/esm'
import { FULL_DATE_SHORT_FORMAT } from '@qc/template/dateFormat'
import { QBRecord } from '@qc/quickblox'

import { createUseComponent, useActions, useMobileLayout } from '../../../hooks'
import {
  getRecords,
  toggleShowModal,
  updateAppointment,
  getUserAvatar,
} from '../../../actionCreators'
import {
  authMyAccountSelector,
  avatarEntriesSelector,
  createAppointmentByIdSelector,
  createRecordsByAppointmentIdSelector,
  createUsersClientByAppointmentIdSelector,
  modalAppointmentChatSelector,
  modalAppointmentIdSelector,
} from '../../../selectors'
import { parseUser } from '../../../utils/user'
import { combineSelectors } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'
import { ABOUT_TAB, AppointmentDetailsTabs } from '../../../constants/tabs'

export interface AppointmentDetailsModalProps {
  onClose?: () => void
}

type AccordeonNamesType =
  | 'client-info'
  | 'consultation-topic'
  | 'video-records'
  | 'conclusion'
  | 'notes'

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    myAccount: authMyAccountSelector,
    opened: modalAppointmentChatSelector,
    avatarEntries: avatarEntriesSelector,
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
  const { appointment, user, avatarEntries } = store
  const actions = useActions({
    getRecords,
    toggleShowModal,
    updateAppointment,
    getUserAvatar,
  })
  const isOffline = useIsOffLine()
  const userAvatar = user ? avatarEntries[user.id] : undefined

  const backdrop = useRef<HTMLDivElement>(null)
  const RESOLUTION_XS = useMobileLayout()
  const [accordeonActive, setAccordeonActive] = useState<AccordeonNamesType>()
  const [activeTab, setActiveTab] = useState<AppointmentDetailsTabs>(ABOUT_TAB)
  const [notes, setNotes] = useState(appointment?.notes)
  const [editingNotes, setEditingNotes] = useState(false)

  const { t, i18n } = useTranslation()

  const currentUser = user && parseUser(user)
  const userName =
    currentUser?.full_name ||
    currentUser?.login ||
    currentUser?.phone ||
    currentUser?.email ||
    t('Unknown')

  const localDate =
    appointment &&
    format(
      new Date(appointment.date_end || appointment.updated_at * 1000),
      // @ts-ignore
      FULL_DATE_SHORT_FORMAT[i18n.language],
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

  const startEditingNotes = () => setEditingNotes(true)

  const stopEditingNotes = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation()

    setEditingNotes(false)
    setNotes(appointment?.notes || '')
  }

  const updateNotes = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    if (appointment) {
      actions.updateAppointment({
        _id: appointment._id,
        data: { notes },
        then: () => setEditingNotes(false),
      })
    }
  }

  const changeNotes = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(value)
  }

  useEffect(() => {
    setNotes(appointment?.notes || '')
    setEditingNotes(false)
  }, [appointment?._id])

  useEffect(() => {
    if (appointment?._id) {
      actions.getRecords(appointment._id)
    }
  }, [appointment?._id])

  useEffect(() => {
    if (appointment?.client_id && !avatarEntries[appointment.client_id]) {
      actions.getUserAvatar(appointment.client_id)
    }
  }, [appointment?.client_id])

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
      notes,
      userAvatar,
    },
    handlers: {
      toggleAccordeon,
      onBackdropClick,
      onCancelClick,
      setActiveTab,
      startEditingNotes,
      stopEditingNotes,
      updateNotes,
      changeNotes,
      editingNotes,
      handleOpenRecordModal,
    },
  }
})
