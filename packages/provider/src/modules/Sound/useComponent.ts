import { useSelector } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { useEffect, useRef, useState } from 'react'
import { StoreState } from '../../reducers'
import {
  authHasSessionSelector,
  authLoadingSelector,
  authMyAccountIdSelector,
  lastReceivedMessageIdSelector,
} from '../../selectors'
import { createUseComponent, usePrevious } from '../../hooks'

interface StateProps {
  loading: boolean
  hasSession: boolean
  myAccountId: QBUser['id']
  lastReceivedMessageId?: QBChatXMPPMessage['id']
}

const audio = new Audio(`${window.location.origin}/dilin.mp3`)

const selector = createStructuredSelector<StoreState, StateProps>({
  hasSession: authHasSessionSelector,
  loading: authLoadingSelector,
  myAccountId: authMyAccountIdSelector,
  lastReceivedMessageId: lastReceivedMessageIdSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const { loading, hasSession, myAccountId, lastReceivedMessageId } = store
  const prevLastReceivedMessageId = usePrevious(lastReceivedMessageId)

  const soundMessageRef = useRef<HTMLAudioElement>(audio)
  const [isShowModal, setIsShowModal] = useState(false)

  const handleCloseModal = () => {
    soundMessageRef.current.load()
    setIsShowModal(false)
  }

  const handleActiveSound = async () => {
    soundMessageRef.current.load()
    await soundMessageRef.current.play()
    soundMessageRef.current.pause()
  }

  const canPlaySound = async () => {
    try {
      await handleActiveSound()

      return true
    } catch (error) {
      return false
    }
  }

  const showModal = async () => {
    const hasAcces = await canPlaySound()

    if (!hasAcces) {
      setIsShowModal(true)
    }
  }

  useEffect(() => {
    const handlePageClick = () => {
      // eslint-disable-next-line promise/catch-or-return
      handleActiveSound().finally(() => {
        document.body.removeEventListener('click', handlePageClick)
      })
    }

    if (
      soundMessageRef.current &&
      !loading &&
      hasSession &&
      myAccountId !== -1
    ) {
      showModal()
    } else {
      document.body.addEventListener('click', handlePageClick)
    }
  }, [soundMessageRef, loading, hasSession, myAccountId])

  useEffect(() => {
    if (
      soundMessageRef.current &&
      lastReceivedMessageId &&
      lastReceivedMessageId !== prevLastReceivedMessageId
    ) {
      soundMessageRef.current.load()
      soundMessageRef.current.play()
    }
  }, [soundMessageRef, lastReceivedMessageId, prevLastReceivedMessageId])

  return {
    store,
    data: { isShowModal },
    handlers: { handleCloseModal },
  }
})
