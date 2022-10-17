import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'

import { toggleShowModal, switchCamera } from '../../../actionCreators'
import {
  modalCameraSelector,
  callSessionSelector,
  callVideoInputSourcesSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { createMapStateSelector } from '../../../utils/selectors'

const selector = createMapStateSelector({
  opened: modalCameraSelector,
  session: callSessionSelector,
  videoInputSources: callVideoInputSourcesSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({
    toggleShowModal,
    switchCamera,
  })
  const { session } = store
  const backdrop = useRef<HTMLDivElement>(null)
  const videoTracks = session?.localStream?.getVideoTracks() || []
  const currentVideoTrack = videoTracks?.find(
    ({ readyState }) => readyState === 'live',
  )
  const { deviceId: currentDeviceId } = currentVideoTrack?.getSettings() || {}
  const [selected, setSelected] = useState<undefined | string>()

  const handleApply = () => {
    if (selected && selected !== currentDeviceId) actions.switchCamera(selected)
    actions.toggleShowModal({ modal: 'CameraModal' })
  }

  const handleClose = () => {
    setSelected(currentDeviceId)
    actions.toggleShowModal({ modal: 'CameraModal' })
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      handleClose()
    }
  }

  useEffect(() => {
    setSelected(currentDeviceId)
  }, [currentDeviceId])

  return {
    store,
    actions,
    refs: { backdrop },
    data: { selected },
    handlers: { handleApply, handleClose, onBackdropClick, setSelected },
  }
})
