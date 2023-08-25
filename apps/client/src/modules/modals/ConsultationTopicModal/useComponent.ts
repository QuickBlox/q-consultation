import {
  MouseEvent as ReactMouseEvent,
  ChangeEvent,
  useRef,
  useState,
  useEffect,
} from 'react'
import { generatePath, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  createAppointment,
  sendSystemMessage,
  toggleShowModal,
} from '../../../actionCreators'
import {
  dialogsLoadingSelector,
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  modalProviderIdSelector,
  modalConsultationTopicSelector,
  modalConsultationTopicValueSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { QBAppointmentCreateSuccessAction } from '../../../actions'
import { APPOINTMENT_ROUTE } from '../../../constants/routes'
import { createMapStateSelector } from '../../../utils/selectors'
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
  consultationTopic: modalConsultationTopicValueSelector,
})

export default createUseComponent((props: ConsultationTopicModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    createAppointment,
    sendSystemMessage,
    toggleShowModal,
  })
  const {
    myAccountId,
    appointmentLoading,
    dialogsLoading,
    providerId,
    opened,
    consultationTopic,
  } = store

  const history = useHistory()
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
      actions.createAppointment({
        client_id: myAccountId,
        provider_id: providerId,
        description,
        then: (actionAppointment: QBAppointmentCreateSuccessAction) => {
          onCancelClick()
          const path = generatePath(APPOINTMENT_ROUTE, {
            appointmentId: actionAppointment.payload._id,
          })

          history.push(path)
        },
      })
    }
  }

  useEffect(() => {
    if (consultationTopic) {
      setDescription(consultationTopic)
    }
  }, [consultationTopic])

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
