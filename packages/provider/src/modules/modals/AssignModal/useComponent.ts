import { MouseEvent as ReactMouseEvent, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import {
  leaveDialog,
  sendSystemMessage,
  toggleShowModal,
  updateAppointment,
  updateDialog,
} from '../../../actionCreators'
import {
  appointmentLoadingSelector,
  authMyAccountSelector,
  createAppointmentByIdSelector,
  dialogsEntriesSelector,
  modalAppointmentIdSelector,
  modalAssignSelector,
  usersSelectedModalAppointmentSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { combineSelectors } from '../../../utils/selectors'
import {
  APPOINTMENT_NOTIFICATION,
  DIALOG_NOTIFICATION,
  TEXT_NOTIFICATION,
} from '../../../constants/notificationTypes'

export interface AssignModalProps {
  onClose?: () => void
}

const selector = combineSelectors(
  {
    appointmentId: modalAppointmentIdSelector,
    opened: modalAssignSelector,
    myAccount: authMyAccountSelector,
    dialogs: dialogsEntriesSelector,
    loading: appointmentLoadingSelector,
    client: usersSelectedModalAppointmentSelector,
  },
  ({ appointmentId }) => ({
    appointment: createAppointmentByIdSelector(appointmentId),
  }),
)

export default createUseComponent((props: AssignModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    leaveDialog,
    sendSystemMessage,
    toggleShowModal,
    updateAppointment,
    updateDialog,
  })
  const { client, dialogs, appointment, myAccount } = store
  const { t } = useTranslation()
  const [value, setValue] = useState<QBUser | undefined>(undefined)
  const backdrop = useRef<HTMLDivElement>(null)

  const userName = client
    ? client.full_name || client.login || client.phone
    : ''

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      actions.toggleShowModal({ modal: 'AssignModal' })

      if (onClose) {
        onClose()
      }
    }
  }

  const filterWithoutCurrentUser = (user: QBUser) => user.id !== myAccount?.id

  const handleAppointmentUpdate = (
    dialogId: QBChatDialog['_id'],
    providerId: QBAppointment['provider_id'],
  ) => {
    if (appointment) {
      actions.sendSystemMessage({
        dialogId: QB.chat.helpers.getUserJid(providerId),
        message: {
          extension: {
            notification_type: DIALOG_NOTIFICATION,
            dialog_id: dialogId,
          },
        },
      })
      actions.leaveDialog(dialogId)
      actions.updateAppointment({
        _id: appointment._id,
        data: { provider_id: providerId },
        then: () => {
          const systemMessageAppointment = {
            extension: {
              notification_type: APPOINTMENT_NOTIFICATION,
              appointment_id: appointment._id,
            },
          }

          const clientSystemMessages = [
            systemMessageAppointment,
            {
              extension: {
                notification_type: TEXT_NOTIFICATION,
                notification_text: 'YOU_HAVE_NEW_PROVIDER',
                translate: 'true',
              },
            },
          ]

          const currentUserName = myAccount
            ? myAccount.full_name || myAccount.login || myAccount.email
            : t('AnotherProvider')

          const providerSystemMessages = [
            systemMessageAppointment,
            {
              extension: {
                notification_type: TEXT_NOTIFICATION,
                notification_text: 'PROVIDER_HAS_ASSIGNED_CLIENT_TO_YOU',
                translate: 'true',
                translate_options: JSON.stringify({
                  provider: currentUserName,
                  client: userName,
                }),
              },
            },
          ]

          clientSystemMessages.forEach((systemMessage) => {
            actions.sendSystemMessage({
              dialogId: QB.chat.helpers.getUserJid(appointment.client_id),
              message: systemMessage,
            })
          })

          providerSystemMessages.forEach((systemMessage) => {
            actions.sendSystemMessage({
              dialogId: QB.chat.helpers.getUserJid(providerId),
              message: systemMessage,
            })
          })

          actions.toggleShowModal({ modal: 'AssignModal' })

          if (onClose) {
            onClose()
          }
        },
      })
    }
  }

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'AssignModal' })

    if (onClose) {
      onClose()
    }
  }

  const reAssignAppointment = () => {
    if (value && appointment) {
      const dialog = dialogs[appointment.dialog_id]

      if (dialog) {
        if (dialog.occupants_ids.includes(value.id)) {
          handleAppointmentUpdate(dialog._id, value.id)
        } else {
          actions.updateDialog({
            dialogId: dialog._id,
            data: {
              push_all: { occupants_ids: [value.id] },
            },
            then: () => {
              sendSystemMessage({
                dialogId: QB.chat.helpers.getUserJid(appointment.client_id),
                message: {
                  extension: {
                    notification_type: DIALOG_NOTIFICATION,
                    dialog_id: dialog._id,
                  },
                },
              })
              handleAppointmentUpdate(dialog._id, value.id)
            },
          })
        }
      }
    }
  }

  return {
    store,
    actions,
    refs: { backdrop },
    data: { userName, value },
    handlers: {
      setValue,
      onBackdropClick,
      onCancelClick,
      reAssignAppointment,
      filterWithoutCurrentUser,
    },
  }
})
