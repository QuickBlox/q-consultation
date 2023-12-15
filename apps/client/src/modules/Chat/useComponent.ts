import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useLocation } from 'react-router-dom'
import QB from '@qc/quickblox'

import { QBAppointment } from '@qc/quickblox/dist/types'
import {
  getDialog,
  listUsers,
  createDialog,
  sendSystemMessage,
  updateAppointment,
} from '../../actionCreators'
import {
  authMyAccountIdSelector,
  callDurationSelector,
  callIsActiveSelector,
  createAppointmentByIdSelector,
  createDialogsByAppointmentIdSelector,
  createUsersProviderByAppointmentIdSelector,
  usersListSelector,
  usersLoadingSelector,
  usersNotFoundSelector,
} from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { QBDialogCreateSuccessAction } from '../../actions'
import { APPOINTMENT_ROUTE } from '../../constants/routes'
import { createMapStateSelector } from '../../utils/selectors'
import { DIALOG_NOTIFICATION } from '../../constants/notificationTypes'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface ChatProps {
  appointmentId?: QBAppointment['_id']
  className?: string
  opened: boolean
  onClose: () => void
}

const createSelector = (appointmentId?: QBAppointment['_id']) =>
  createMapStateSelector({
    myAccountId: authMyAccountIdSelector,
    isActiveCall: callIsActiveSelector,
    callDuration: callDurationSelector,
    userList: usersListSelector,
    usersLoading: usersLoadingSelector,
    usersNotFound: usersNotFoundSelector,
    currentAppointment: createAppointmentByIdSelector(appointmentId),
    currentDialog: createDialogsByAppointmentIdSelector(appointmentId),
    currentProvider: createUsersProviderByAppointmentIdSelector(appointmentId),
  })

export default createUseComponent((props: ChatProps) => {
  const { appointmentId } = props
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const actions = useActions({
    getDialog,
    listUsers,
    createDialog,
    updateAppointment,
    sendSystemMessage,
  })
  const isOffline = useIsOffLine()
  const {
    userList,
    myAccountId,
    currentAppointment,
    currentDialog,
    currentProvider,
    usersLoading,
    isActiveCall,
    usersNotFound,
  } = store
  const { t } = useTranslation()

  const navigate = useNavigate()
  const location = useLocation() as { state: { chatOpen: boolean } | null }
  const { chatOpen } = location.state || {}

  const dialogName =
    currentProvider?.full_name ||
    currentProvider?.login ||
    currentProvider?.phone ||
    currentProvider?.email ||
    t('Unknown')

  const handleCloseChat = () => {
    if (appointmentId) {
      const path = generatePath(APPOINTMENT_ROUTE, {
        appointmentId,
      })

      navigate(path, { state: { chatOpen: false }, replace: true })
    }
  }

  useEffect(() => {
    if (isActiveCall) {
      handleCloseChat()
    }
  }, [isActiveCall])

  useEffect(() => {
    if (currentAppointment && !isOffline) {
      if (currentAppointment.dialog_id) {
        actions.getDialog({
          _id: currentAppointment.dialog_id,
        })
      } else {
        actions.createDialog({
          userId: currentAppointment.provider_id,
          then: (action: QBDialogCreateSuccessAction) => {
            actions.updateAppointment({
              _id: currentAppointment._id,
              data: {
                dialog_id: action.payload._id,
              },
              then: () => {
                actions.sendSystemMessage({
                  dialogId: QB.chat.helpers.getUserJid(
                    currentAppointment.provider_id,
                  ),
                  message: {
                    extension: {
                      notification_type: DIALOG_NOTIFICATION,
                      dialog_id: action.payload._id,
                    },
                  },
                })
              },
            })
          },
        })
      }
    }
  }, [currentAppointment?.dialog_id, isOffline])

  useEffect(() => {
    if (currentDialog && !usersLoading) {
      const occupantsList = currentDialog.occupants_ids.filter(
        (userId) =>
          !usersNotFound.includes(userId) &&
          userId !== myAccountId &&
          userList.findIndex((user) => user.id === userId) === -1,
      )

      if (occupantsList.length) {
        actions.listUsers({
          filter: {
            field: 'id',
            param: 'in',
            value: occupantsList,
          },
          per_page: occupantsList.length,
        })
      }
    }
  }, [currentDialog, userList, usersLoading, usersNotFound])

  return {
    store,
    actions,
    data: {
      chatOpen,
      dialogName,
    },
    handlers: {
      handleCloseChat,
    },
  }
})
