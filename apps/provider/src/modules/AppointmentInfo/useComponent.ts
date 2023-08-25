import { MouseEvent as ReactMouseEvent, useState } from 'react'

import { createUseComponent, useActions } from '../../hooks'
import { toggleShowModal } from '../../actionCreators'
import { parseUserCustomData } from '../../utils/user'

type FieldType = 'user-info' | 'description' | 'notes' | 'records'

export interface AppointmentInfoProps {
  appointment?: QBAppointment
  user?: QBUser
  records?: QBRecord[]
}

export default createUseComponent((props: AppointmentInfoProps) => {
  const { appointment, user } = props
  const actions = useActions({
    toggleShowModal,
  })
  const [fieldActive, setFieldActive] = useState<FieldType>()

  const description = appointment?.description || ''
  const userInfo = user?.custom_data
    ? parseUserCustomData(user.custom_data)
    : {}

  const toggleField = (fieldName: FieldType) => {
    setFieldActive(fieldName === fieldActive ? undefined : fieldName)
  }

  const handleOpenRecordModal = (recordId: QBRecord['_id']) => {
    actions.toggleShowModal({ modal: 'RecordModal', recordId })
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

  return {
    data: { description, userInfo, fieldActive },
    handlers: {
      toggleField,
      startEditingNotes,
      handleOpenRecordModal,
    },
  }
})
