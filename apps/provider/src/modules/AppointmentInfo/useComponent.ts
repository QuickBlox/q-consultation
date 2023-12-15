import { ChangeEvent, useEffect, useState } from 'react'
import { QBAppointment, QBUser, QBRecord } from '@qc/quickblox'

import { createUseComponent, useActions } from '../../hooks'
import { updateAppointment, toggleShowModal } from '../../actionCreators'
import { parseUserCustomData } from '../../utils/user'
import useIsOffLine from '../../hooks/useIsOffLine'

type FieldType = 'user-info' | 'description' | 'records'

export interface AppointmentInfoProps {
  appointment?: QBAppointment
  user?: QBUser
  records?: QBRecord[]
}

export default createUseComponent((props: AppointmentInfoProps) => {
  const { appointment, user } = props
  const actions = useActions({
    updateAppointment,
    toggleShowModal,
  })
  const [fieldActive, setFieldActive] = useState<FieldType>()
  const [notes, setNotes] = useState(appointment?.notes)
  const [editingNotes, setEditingNotes] = useState(false)
  const isOffline = useIsOffLine()

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

  const startEditingNotes = () => setEditingNotes(true)

  const stopEditingNotes = () => {
    setEditingNotes(false)
    setNotes(appointment?.notes || '')
  }

  const updateNotes = () => {
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

  return {
    data: {
      description,
      userInfo,
      notes,
      fieldActive,
      isOffline,
    },
    handlers: {
      toggleField,
      startEditingNotes,
      stopEditingNotes,
      updateNotes,
      changeNotes,
      editingNotes,
      handleOpenRecordModal,
    },
  }
})
