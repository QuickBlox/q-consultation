import { MouseEvent as ReactMouseEvent, useRef } from 'react'

import { createUseComponent } from '../../../hooks'

export interface ActivateSoundNotificationModalProps {
  open: boolean
  onClose: () => void
}

export default createUseComponent(
  ({ onClose }: ActivateSoundNotificationModalProps) => {
    const backdrop = useRef<HTMLDivElement>(null)

    const handleBackdropClick = (
      e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
      if (backdrop.current && e.target === backdrop.current) {
        onClose()
      }
    }

    return {
      refs: { backdrop },
      handlers: { handleBackdropClick },
    }
  },
)
