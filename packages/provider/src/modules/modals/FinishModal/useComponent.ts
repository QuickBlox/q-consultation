import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import { useSelector } from 'react-redux'

import { toggleShowModal } from '../../../actionCreators'
import {
  usersSelectedModalAppointmentSelector,
  modalFinishSelector,
  modalAppointmentIdSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { createMapStateSelector } from '../../../utils/selectors'

export interface FinishModalProps {
  onClose?: () => void
}

const selector = createMapStateSelector({
  appointmentId: modalAppointmentIdSelector,
  opened: modalFinishSelector,
  client: usersSelectedModalAppointmentSelector,
})

export default createUseComponent((props: FinishModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({ toggleShowModal })
  const { client, appointmentId } = store
  const backdrop = useRef<HTMLDivElement>(null)

  const userName = client
    ? client.full_name || client.login || client.phone
    : ''

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'FinishModal' })

    if (onClose) {
      onClose()
    }
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const onFinishClick = () => {
    actions.toggleShowModal({ modal: 'FinishModal', appointmentId })
    actions.toggleShowModal({ modal: 'ConclusionModal', appointmentId })

    if (onClose) {
      onClose()
    }
  }

  return {
    store,
    refs: { backdrop },
    data: { userName },
    handlers: {
      onCancelClick,
      onFinishClick,
      onBackdropClick,
    },
  }
})
