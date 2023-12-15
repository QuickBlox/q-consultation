import { useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

import {
  acceptCall,
  rejectCall,
  listUsers,
  toggleCallModal,
  getUserAvatar,
} from '../../../actionCreators'
import {
  authMyAccountIdSelector,
  avatarEntriesSelector,
  modalCallDataSelector,
  modalCallSelector,
  usersEntriesSelector,
  usersLoadingSelector,
  usersNotFoundSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { createMapStateSelector } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'
import { getCallOpponentId, parseUser } from '../../../utils/user'

export interface CallModalProps {
  onClose?: () => void
}

const selector = createMapStateSelector({
  opened: modalCallSelector,
  users: usersEntriesSelector,
  callData: modalCallDataSelector,
  usersLoading: usersLoadingSelector,
  usersNotFound: usersNotFoundSelector,
  myAccountId: authMyAccountIdSelector,
  avatarEntries: avatarEntriesSelector,
})

export default createUseComponent((props: CallModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    toggleCallModal,
    acceptCall,
    rejectCall,
    listUsers,
    getUserAvatar,
  })
  const {
    callData,
    users,
    usersLoading,
    usersNotFound,
    myAccountId,
    avatarEntries,
  } = store
  const backdrop = useRef<HTMLDivElement>(null)
  const isOffline = useIsOffLine()
  const opponentId = useMemo(
    () => getCallOpponentId(myAccountId, callData?.session),
    [myAccountId, callData?.session],
  )

  const userInfo =
    opponentId && users[opponentId] ? parseUser(users[opponentId]) : undefined
  const userAvatar = userInfo ? avatarEntries[userInfo.id] : undefined

  const onCancelClick = () => {
    actions.toggleCallModal()

    if (onClose) {
      onClose()
    }
  }

  const onAcceptClick = () => {
    onCancelClick()

    if (callData && callData.userInfo) {
      actions.acceptCall({
        session: callData.session,
        start: callData.userInfo.start,
        appointmentId: callData.userInfo.appointmentId,
      })
    }
  }

  const onDeclineClick = () => {
    onCancelClick()

    if (callData) {
      actions.rejectCall({
        reason: 'USER_REJECTED_CALL',
        session: callData.session,
      })
    }
  }

  useEffect(() => {
    if (opponentId && !users[opponentId] && !usersLoading) {
      actions.listUsers({
        filter: {
          field: 'id',
          param: 'in',
          value: opponentId,
        },
      })
    }
  }, [opponentId, usersLoading, usersNotFound])

  useEffect(() => {
    if (opponentId && !avatarEntries[opponentId]) {
      actions.getUserAvatar(opponentId)
    }
  }, [opponentId])

  return {
    store,
    actions,
    refs: { backdrop },
    data: { userInfo, isOffline, userAvatar },
    handlers: { onAcceptClick, onDeclineClick },
  }
})
