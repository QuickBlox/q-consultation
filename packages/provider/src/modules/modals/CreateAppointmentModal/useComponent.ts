import { MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  getAppointments,
  createAppointment,
  createDialog,
  sendSystemMessage,
  toggleShowModal,
} from '../../../actionCreators'
import {
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  modalCreateAppointmentSelector,
} from '../../../selectors'
import { createUseComponent, useActions, useForm } from '../../../hooks'
import { createMapStateSelector } from '../../../utils/selectors'
import { QBAppointmentCreateSuccessAction, QBAppointmentGetSuccessAction, QBDialogCreateSuccessAction } from '../../../actions'
import { APPOINTMENT_NOTIFICATION, DIALOG_NOTIFICATION } from '../../../constants/notificationTypes'

interface FormValues {
  client_id: QBUser['id'] | undefined
  description: string
}

interface FormErrors {
  client_id: string
  description: string
}

export interface CreateAppointmentModalProps {
  onClose?: () => void
}

const selector = createMapStateSelector(
  {
    loading: appointmentLoadingSelector,
    opened: modalCreateAppointmentSelector,
    myAccountId: authMyAccountIdSelector,
  }
)

export default createUseComponent((props: CreateAppointmentModalProps) => {
  const { onClose } = props
  const [error, setError] = useState('')
  const store = useSelector(selector)
  const actions = useActions({
    getAppointments,
    createAppointment,
    createDialog,
    sendSystemMessage,
    toggleShowModal,
  })
  const { myAccountId, opened } = store
  const backdrop = useRef<HTMLDivElement>(null)

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'CreateAppointmentModal' })

    if (onClose) {
      onClose()
    }
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const handleValidate = (values: FormValues) => {
    const errors: Partial<FormErrors> = {}

    const requiredFields = <const>['client_id', 'description']
    const messageRequired = 'REQUIRED'

    requiredFields.forEach((name) => {
      if (!values[name]) errors[name] = messageRequired
    })

    return errors
  }

  const handleSubmit = (values: FormValues) => {
    setError('')

    if (values.client_id) {
      const clientId = values.client_id

      actions.getAppointments({
        filters: {
          client_id: clientId,
          provider_id: myAccountId,
          date_end: null,
          date_start: null,
        }
      }, ({ payload: { liveQueue } }: QBAppointmentGetSuccessAction) => {
        if (liveQueue.length) {
          setError('AppointmentAlreadyExists')
        } else {
          actions.createDialog({
            userIds: [clientId, myAccountId],
            then: (actionDialog: QBDialogCreateSuccessAction) => {
              actions.createAppointment({
                client_id: clientId,
                provider_id: myAccountId,
                dialog_id: actionDialog.payload._id,
                description: values.description,
                then: (actionAppointment: QBAppointmentCreateSuccessAction) => {
                  const systemMessages = [
                    {
                      extension: {
                        notification_type: DIALOG_NOTIFICATION,
                        dialog_id: actionDialog.payload._id,
                      },
                    },
                    {
                      extension: {
                        notification_type: APPOINTMENT_NOTIFICATION,
                        appointment_id: actionAppointment.payload._id,
                      },
                    },
                  ]

                  systemMessages.forEach((systemMessage) => {
                    actions.sendSystemMessage({
                      dialogId: QB.chat.helpers.getUserJid(clientId),
                      message: systemMessage,
                    })
                  })

                  onCancelClick()
                },
              })
            },
          })
        }
      })

    }
  }

  const appointmentForm = useForm<FormValues, FormErrors>({
    initialValues: {
      client_id: undefined,
      description: '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  const handleSelectClient = (user: QBUser) => {
    appointmentForm.setFieldValue('client_id', user.id)
  }

  const filterClients = (user: QBUser) =>
    !user.user_tags?.includes(PROVIDER_TAG)

  useEffect(() => {
    if (!opened) {
      setError('')
      appointmentForm.reinitialize()
    }
  }, [opened])

  return {
    store,
    actions,
    data: { error },
    refs: { backdrop },
    forms: { appointmentForm },
    handlers: {
      onBackdropClick,
      onCancelClick,
      handleSelectClient,
      filterClients,
    },
  }
})
