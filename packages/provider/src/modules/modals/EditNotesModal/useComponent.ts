import {
  MouseEvent as ReactMouseEvent,
  ChangeEvent,
  useRef,
  useState,
  useEffect,
} from 'react'
import { useSelector } from 'react-redux'

import { toggleShowModal, updateAppointment } from '../../../actionCreators'
import {
  modalEditNotesSelector,
  createAppointmentByIdSelector,
  modalAppointmentIdSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { combineSelectors } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'

export interface EditNotesModalProps {
  onClose?: VoidFunction
}

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    opened: modalEditNotesSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: EditNotesModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    toggleShowModal,
    updateAppointment,
  })
  const { appointment } = store

  const backdrop = useRef<HTMLDivElement>(null)
  const isOffline = useIsOffLine()
  const [notes, setNotes] = useState('')

  const onCancelClick = () => {
    actions.toggleShowModal({
      modal: 'EditNotesModal',
      appointmentId: appointment?._id,
    })

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

  const handleChangeNotes = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(value)
  }

  const handleSubmit = () => {
    if (appointment) {
      actions.updateAppointment({
        _id: appointment._id,
        data: { notes },
        then: () => {
          onCancelClick()
        },
      })
    }
  }

  useEffect(() => {
    setNotes(appointment?.notes || '')
  }, [appointment?.notes])

  return {
    store,
    actions,
    refs: { backdrop },
    data: { notes, isOffline },
    handlers: {
      handleBackdropClick,
      handleChangeNotes,
      handleSubmit,
      onCancelClick,
    },
  }
})
