import {
  MouseEvent as ReactMouseEvent,
  ChangeEvent,
  useRef,
  useState,
  useEffect,
} from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import QB from '@qc/quickblox'

import {
  createAppointment,
  createDialog,
  sendSystemMessage,
  toggleShowModal,
} from '../../../actionCreators'
import {
  dialogsLoadingSelector,
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  modalProviderIdSelector,
  modalConsultationTopicSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import {
  QBAppointmentCreateSuccessAction,
  QBDialogCreateSuccessAction,
} from '../../../actions'
import { APPOINTMENT_ROUTE } from '../../../constants/routes'
import { createMapStateSelector } from '../../../utils/selectors'
import {
  APPOINTMENT_NOTIFICATION,
  DIALOG_NOTIFICATION,
} from '../../../constants/notificationTypes'
import useIsOffLine from '../../../hooks/useIsOffLine'

export interface ConsultationTopicModalProps {
  onClose?: VoidFunction
}

const selector = createMapStateSelector({
  myAccountId: authMyAccountIdSelector,
  appointmentLoading: appointmentLoadingSelector,
  dialogsLoading: dialogsLoadingSelector,
  providerId: modalProviderIdSelector,
  opened: modalConsultationTopicSelector,
})

export default createUseComponent((props: ConsultationTopicModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    createAppointment,
    createDialog,
    sendSystemMessage,
    toggleShowModal,
  })
  const {
    myAccountId,
    appointmentLoading,
    dialogsLoading,
    providerId,
    opened,
  } = store

  const navigate = useNavigate()
  const backdrop = useRef<HTMLDivElement>(null)
  const [description, setDescription] = useState('')
  const isOffline = useIsOffLine()
  const loading = appointmentLoading || dialogsLoading

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'ConsultationTopicModal' })

    if (onClose) {
      onClose()
    }
  }

  const handleBackdropClick = (
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const handleChangeDescription = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(value)
  }

  const handleJoinDialog = () => {
    if (providerId) {
      actions.createDialog({
        userId: providerId,
        then: (actionDialog: QBDialogCreateSuccessAction) => {
          actions.createAppointment({
            client_id: myAccountId,
            provider_id: providerId,
            dialog_id: actionDialog.payload._id,
            description,
            then: (actionAppointment: QBAppointmentCreateSuccessAction) => {
              const systemMessages = <const>[
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
                  dialogId: QB.chat.helpers.getUserJid(providerId),
                  message: systemMessage,
                })
              })
              onCancelClick()
              const path = generatePath(APPOINTMENT_ROUTE, {
                appointmentId: actionAppointment.payload._id,
              })

              navigate(path)
            },
          })
        },
      })
    }
  }

  useEffect(() => {
    if (!opened) {
      setDescription('')
    }
  }, [opened])

  return {
    store,
    actions,
    refs: { backdrop },
    data: { loading, description, isOffline },
    handlers: {
      handleBackdropClick,
      handleChangeDescription,
      handleJoinDialog,
      onCancelClick,
    },
  }
})
