import { MouseEvent as ReactMouseEvent, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useMatch } from 'react-router-dom'
import QB, { QBAppointment } from '@qc/quickblox'

import {
  leaveDialog,
  sendSystemMessage,
  toggleShowModal,
  updateAppointment,
  showNotification,
} from '../../../actionCreators'
import {
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  createAppointmentByIdSelector,
  dialogsEntriesSelector,
  modalAppointmentIdSelector,
  modalConclusionSelector,
  usersSelectedModalAppointmentSelector,
} from '../../../selectors'
import { createUseComponent, useActions, useForm } from '../../../hooks'
import { combineSelectors } from '../../../utils/selectors'
import {
  APPOINTMENT_NOTIFICATION,
  CONCLUSION_NOTIFICATION,
} from '../../../constants/notificationTypes'
import {
  APPOINTMENT_TYPE_ROUTE,
  SELECTED_APPOINTMENT_ROUTE,
} from '../../../constants/routes'
import { QUEUE_TYPE } from '../../../constants/tabs'

export interface ConclusionModalProps {
  onClose?: () => void
}

type FormValues = Required<Pick<QBAppointment, 'conclusion' | 'language'>>

type FormErrors = Partial<DictionaryByKey<FormValues, string>>

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    opened: modalConclusionSelector,
    myAccountId: authMyAccountIdSelector,
    dialogs: dialogsEntriesSelector,
    appointmentLoading: appointmentLoadingSelector,
    client: usersSelectedModalAppointmentSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: ConclusionModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    leaveDialog,
    sendSystemMessage,
    toggleShowModal,
    updateAppointment,
    showNotification,
  })
  const {
    appointmentId,
    client,
    appointment,
    dialogs,
    opened,
    appointmentLoading,
  } = store
  const backdrop = useRef<HTMLDivElement>(null)
  const { i18n } = useTranslation()
  const matchAppointments = useMatch(SELECTED_APPOINTMENT_ROUTE)
  const navigate = useNavigate()

  const loading = appointmentLoading
  const userName = client
    ? client.full_name || client.login || client.phone
    : ''

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      actions.toggleShowModal({ modal: 'ConclusionModal' })

      if (onClose) {
        onClose()
      }
    }
  }

  const sendSystemMessageRemoveDialogAndClose = () => {
    if (appointment) {
      const systemMessage = {
        extension: {
          notification_type: APPOINTMENT_NOTIFICATION,
          appointment_id: appointment._id,
        },
      }

      actions.sendSystemMessage({
        dialogId: QB.chat.helpers.getUserJid(appointment.client_id),
        message: systemMessage,
      })
      const dialog = dialogs[appointment.dialog_id]

      if (dialog) {
        actions.leaveDialog(dialog._id)
      }
    }
    actions.toggleShowModal({ modal: 'ConclusionModal' })

    if (onClose) {
      onClose()
    }

    if (
      matchAppointments &&
      appointmentId === matchAppointments.params.appointmentId
    ) {
      const path = generatePath(APPOINTMENT_TYPE_ROUTE, {
        appointmentType: matchAppointments.params.appointmentType || QUEUE_TYPE,
      })

      navigate(path)
    }
  }

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'ConclusionModal' })

    if (onClose) {
      onClose()
    }
  }

  const skipAppointment = () => {
    if (appointment) {
      actions.updateAppointment({
        _id: appointment._id,
        data: {
          date_end: new Date().toISOString(),
        },
        then: sendSystemMessageRemoveDialogAndClose,
      })
    }
  }

  const handleSubmit = (values: FormValues) => {
    if (appointment) {
      const systemMessage = {
        extension: {
          notification_type: CONCLUSION_NOTIFICATION,
          notification_text: values.conclusion!,
        },
      }

      actions.sendSystemMessage({
        dialogId: QB.chat.helpers.getUserJid(appointment.client_id),
        message: systemMessage,
        then: () => {
          if (appointment) {
            actions.updateAppointment({
              _id: appointment._id,
              data: {
                language: values.language,
                conclusion: values.conclusion,
                date_end: new Date().toISOString(),
              },
              then: sendSystemMessageRemoveDialogAndClose,
            })
          }
        },
      })
    }
  }

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}

    if (!values.conclusion) errors.conclusion = 'REQUIRED'

    return errors
  }

  const conclusionForm = useForm<FormValues, FormErrors>({
    initialValues: {
      language: i18n.language,
      conclusion: '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (!opened) {
      conclusionForm.reinitialize()
    }
  }, [opened])

  return {
    store,
    actions,
    forms: { conclusionForm },
    refs: { backdrop },
    data: { userName, loading },
    handlers: {
      onCancelClick,
      onBackdropClick,
      skipAppointment,
    },
  }
})
