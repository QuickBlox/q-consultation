import { useSelector } from 'react-redux'

import { useEffect, useRef, useState } from 'react'
import {
  authHasSessionSelector,
  authLoadingSelector,
  authMyAccountIdSelector,
  modalCallSelector,
} from '../../selectors'
import { createUseComponent } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'

const phoneRingAudio = new Audio(`${window.location.origin}/phone-ring.wav`)

phoneRingAudio.loop = true
phoneRingAudio.defaultMuted = true

const selector = createMapStateSelector({
  hasSession: authHasSessionSelector,
  loading: authLoadingSelector,
  myAccountId: authMyAccountIdSelector,
  callModalOpened: modalCallSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const { loading, hasSession, myAccountId, callModalOpened } = store

  const soundMessageRef = useRef<HTMLAudioElement>(phoneRingAudio)
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
    const hasAccess = await canPlaySound()

    if (!hasAccess) {
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
    let interval: number | undefined

    if (soundMessageRef.current && callModalOpened) {
      soundMessageRef.current.load()
      soundMessageRef.current.muted = false
      soundMessageRef.current.play()
    } else {
      soundMessageRef.current.pause()
      soundMessageRef.current.muted = true
    }

    return () => window.clearInterval(interval)
  }, [soundMessageRef, callModalOpened])

  return {
    store,
    data: { isShowModal },
    handlers: { handleCloseModal },
  }
})
