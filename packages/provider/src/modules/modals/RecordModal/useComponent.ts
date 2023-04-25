import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
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
    recordId: modalRecordIdSelector
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
  const isOffline = useIsOffLine()

  const backdrop = useRef<HTMLDivElement>(null)
  const RESOLUTION_XS = useMobileLayout()

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
    },
    handlers: {
      onBackdropClick,
      onCancelClick,
      setActiveTab,
    },
  }
})
