import { MouseEvent as ReactMouseEvent, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { createUseComponent, useActions, useMobileLayout } from '../../../hooks'
import { toggleShowModal } from '../../../actionCreators'
import {
  createRecordsByIdSelector,
  modalRecordIdSelector,
  modalRecordSelector,
} from '../../../selectors'
import { combineSelectors } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'

export interface RecordModalProps {
  onClose?: () => void
}

type TabsList = 'summary' | 'transcript'

const selector = combineSelectors(
  {
    opened: modalRecordSelector,
    recordId: modalRecordIdSelector,
  },
  ({ recordId }) => ({
    record: createRecordsByIdSelector(recordId),
  }),
)

export default createUseComponent((props: RecordModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    toggleShowModal,
  })
  const [activeTab, setActiveTab] = useState<TabsList>('summary')
  const [isSupportedVideo, setIsSupportedVideo] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const isOffline = useIsOffLine()

  const backdrop = useRef<HTMLDivElement>(null)
  const RESOLUTION_XS = useMobileLayout()

  const { record } = store

  const handleVideoError = () => {
    setIsSupportedVideo(false)
  }

  const handleDownloadRecord = async () => {
    if (record?.uid) {
      setIsDownloading(true)
      const file = await fetch(QB.content.privateUrl(record.uid)).then((res) =>
        res.blob(),
      )
      const linkElement = document.createElement('a')

      linkElement.setAttribute('download', record.name)
      const link = URL.createObjectURL(file)

      linkElement.setAttribute('href', link)
      linkElement.setAttribute('target', '_blank')
      linkElement.click()
      URL.revokeObjectURL(link)
      setIsDownloading(false)
    }
  }

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'RecordModal' })

    if (onClose) {
      onClose()
    }
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  return {
    store,
    refs: { backdrop },
    data: {
      RESOLUTION_XS,
      isOffline,
      activeTab,
      isSupportedVideo,
      isDownloading,
    },
    handlers: {
      onBackdropClick,
      onCancelClick,
      setActiveTab,
      handleVideoError,
      handleDownloadRecord,
    },
  }
})
