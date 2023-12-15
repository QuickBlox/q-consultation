import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { QBAppointment } from '@qc/quickblox'

import {
  getDialog,
  listUsers,
  startCall,
  updateAppointment,
  getQuickAnswerCancel,
} from '../../actionCreators'
import {
  appointmentDialogIdListSelector,
  authMyAccountSelector,
  authSessionSelector,
  callSessionSelector,
  chatConnectedSelector,
  createAppointmentByIdSelector,
  createDialogsByAppointmentIdSelector,
  dialogsEntriesSelector,
  dialogsLoadingSelector,
  qbReadySelector,
  usersEntriesSelector,
  usersLoadingSelector,
  createRecordsByAppointmentIdSelector,
} from '../../selectors'
import { createUseComponent, useActions, useMobileLayout } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import { SELECTED_APPOINTMENT_ROUTE } from '../../constants/routes'
import {
  ABOUT_TAB,
  AppointmentTypes,
  CALL_TAB,
  ChatTabs,
} from '../../constants/tabs'

export interface ChatProps {
  appointmentId?: QBAppointment['_id']
}

const createSelector = (appointmentId?: QBAppointment['_id']) =>
  createMapStateSelector({
    dialogIdList: appointmentDialogIdListSelector,
    appointment: createAppointmentByIdSelector(appointmentId),
    call: callSessionSelector,
    currentDialog: createDialogsByAppointmentIdSelector(appointmentId),
    dialogs: dialogsEntriesSelector,
    fetchingDialogs: dialogsLoadingSelector,
    ready: qbReadySelector,
    session: authSessionSelector,
    myAccount: authMyAccountSelector,
    users: usersEntriesSelector,
    usersLoading: usersLoadingSelector,
    records: createRecordsByAppointmentIdSelector(appointmentId),
    connected: chatConnectedSelector,
  })

export default createUseComponent((props: ChatProps) => {
  const { appointmentId } = props
  const selector = createSelector(appointmentId)
  const store = useSelector(selector)
  const actions = useActions({
    getDialog,
    startCall,
    listUsers,
    updateAppointment,
    getQuickAnswerCancel,
  })
  const {
    ready,
    call,
    users,
    session,
    myAccount,
    appointment,
    currentDialog,
    dialogIdList,
    dialogs,
    fetchingDialogs,
  } = store
  const { t } = useTranslation()
  const { tab, appointmentType } = useParams<{
    tab: ChatTabs
    appointmentType: AppointmentTypes
  }>()
  const [activeTab, setActiveTab] = useState<ChatTabs>(tab || ABOUT_TAB)
  const callTabRef = useRef<HTMLButtonElement>(null)
  const chatInputRef = useRef<HTMLDivElement>(null)
  const RESOLUTION_XS = useMobileLayout()
  const isOffline = useIsOffLine()
  const navigate = useNavigate()

  const activeAppointment =
    appointment &&
    appointment.provider_id === myAccount?.id &&
    !appointment.date_end
      ? appointment
      : undefined

  const companion = activeAppointment && users[activeAppointment.client_id]

  const dialogName = activeAppointment
    ? companion?.full_name ||
      companion?.login ||
      companion?.phone ||
      companion?.email ||
      t('Unknown')
    : undefined

  const handleSetInputValue = (value: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.innerText = value
    }
  }

  const handleChangeTab = () => {
    if (activeTab && appointmentId && appointmentType) {
      const path = generatePath(SELECTED_APPOINTMENT_ROUTE, {
        appointmentType,
        tab: activeTab,
        appointmentId,
      })

      navigate(path)
    }
  }

  useEffect(() => {
    if (
      ready &&
      session &&
      !fetchingDialogs &&
      dialogIdList?.length &&
      !isOffline
    ) {
      const missingDialogIds = dialogIdList.filter(
        (dialogId) => !dialogs[dialogId],
      )

      if (missingDialogIds.length) {
        actions.getDialog({ '_id[in]': missingDialogIds.join() })
      }
    }
  }, [ready, dialogIdList, dialogs, isOffline])

  useEffect(() => {
    if (!fetchingDialogs && dialogIdList?.length && !isOffline) {
      actions.getDialog({ '_id[in]': dialogIdList.join() })
    }
  }, [isOffline])

  useEffect(() => {
    if (currentDialog && !isOffline) {
      const occupantsList = currentDialog.occupants_ids.filter(
        (userId) => userId !== myAccount?.id,
      )
      const missingUsersIds = occupantsList.filter((userId) => !users[userId])

      if (missingUsersIds.length) {
        actions.listUsers({
          filter: {
            field: 'id',
            param: 'in',
            value: missingUsersIds,
          },
          per_page: missingUsersIds.length,
        })
      }
    }
  }, [currentDialog, isOffline])

  useEffect(() => {
    if (call && RESOLUTION_XS && callTabRef.current) {
      callTabRef.current.click()
    }
  }, [call, RESOLUTION_XS])

  useEffect(() => {
    handleChangeTab()

    if (!RESOLUTION_XS && activeTab === CALL_TAB) {
      setActiveTab(ABOUT_TAB)
    }
  }, [RESOLUTION_XS, activeTab])

  useEffect(() => {
    if (isOffline || !tab) {
      setActiveTab(ABOUT_TAB)
    } else {
      actions.getQuickAnswerCancel()
    }
  }, [appointmentId, tab])

  useEffect(() => {
    setActiveTab(ABOUT_TAB)
  }, [appointmentType])

  return {
    store,
    actions,
    refs: { callTabRef, chatInputRef },
    data: {
      activeTab,
      dialogName,
      activeAppointment,
      RESOLUTION_XS,
      companion,
      isOffline,
    },
    handlers: {
      setActiveTab,
      handleSetInputValue,
    },
  }
})
