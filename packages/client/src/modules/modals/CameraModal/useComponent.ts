import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'

import { switchCamera } from '../../../actionCreators'
import {
  callSessionSelector,
  callVideoInputSourcesSelector,
} from '../../../selectors'
import { createUseComponent, useActions } from '../../../hooks'
import { createMapStateSelector } from '../../../utils/selectors'

export interface CameraModalProps {
  onClose?: () => void
  open: boolean
}

const selector = createMapStateSelector({
  session: callSessionSelector,
  videoInputSources: callVideoInputSourcesSelector,
})

export default createUseComponent((props: CameraModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
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

    if (onClose) onClose()
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
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
