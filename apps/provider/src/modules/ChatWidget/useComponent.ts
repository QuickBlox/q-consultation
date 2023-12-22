import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QBUser } from '@qc/quickblox'

import { getDialog, createDialog, listUsers } from '../../actionCreators'
import {
  appointmentDialogIdListSelector,
  chatConnectedSelector,
  dialogsEntriesSelector,
  dialogsLoadingSelector,
  qbReadySelector,
  usersEntriesSelector,
  usersLoadingSelector,
} from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'

export interface ChatWidgetProps {
  userId: QBUser['id']
}

const createSelector = () =>
  createMapStateSelector({
    dialogIdList: appointmentDialogIdListSelector,
    dialogs: dialogsEntriesSelector,
    fetchingDialogs: dialogsLoadingSelector,
    ready: qbReadySelector,
    users: usersEntriesSelector,
    usersLoading: usersLoadingSelector,
    connected: chatConnectedSelector,
  })

export default createUseComponent((props: ChatWidgetProps) => {
  const { userId } = props
  const selector = createSelector()
  const store = useSelector(selector)
  const actions = useActions({
    getDialog,
    createDialog,
    listUsers,
  })
  const { users } = store
  const { t } = useTranslation()
  const chatInputRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isShowChat, setIsShowChat] = useState(false)
  const [dialogId, setDialogId] = useState<string>()

  const companion = users[userId]
  const dialogName =
    companion?.full_name ||
    companion?.login ||
    companion?.phone ||
    companion?.email ||
    t('Unknown')

  const handleClickToggleAssistant = () => {
    setIsShowChat((value) => !value)
  }

  const handleSetInputValue = (value: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.innerText = value
    }
  }

  const clickHandler = (e: Event) => {
    if (
      containerRef.current &&
      e.target instanceof Node &&
      !containerRef.current.contains(e.target)
    ) {
      setIsShowChat(false)
    }
  }

  useEffect(() => {
    if (containerRef) {
      document.addEventListener('click', clickHandler)
    }

    return () => document.removeEventListener('click', clickHandler)
  }, [])

  useEffect(() => {
    actions.listUsers({
      filter: {
        field: 'id',
        param: 'in',
        value: userId,
      },
    })
    actions.getDialog({
      type: 3,
      // TODO: [SR-2083] Operator occupants_ids[in] is not working for list dialogs request
      // 'occupants_ids[in]': userId.toString(),
      then: ({ payload: dialogs }) => {
        const dialogWithAssistant = Object.values(dialogs).find(
          ({ occupants_ids }) => occupants_ids.includes(userId),
        )

        if (dialogWithAssistant?._id) {
          setDialogId(dialogWithAssistant._id)
        } else {
          actions.createDialog({
            userIds: userId,
            type: 'private',
            then: ({ payload: newDialog }) => {
              setDialogId(newDialog._id)
            },
          })
        }
      },
    })
  }, [userId])

  return {
    store,
    actions,
    refs: { chatInputRef, containerRef },
    data: {
      isShowChat,
      dialogName,
      dialogId,
    },
    handlers: {
      handleSetInputValue,
      handleClickToggleAssistant,
    },
  }
})
