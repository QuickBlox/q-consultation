import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import Bowser from 'bowser'

import { createUseComponent } from '../../../hooks'

const BROWSER_COMPATIBILITY_NOFIFICATION = 'BROWSER_COMPATIBILITY_NOFIFICATION'

export const compatibleBrowsers: Dictionary<string[]> = {
  iOS: ['Safari'],
  Android: ['Chrome', 'Firefox', 'Opera'],
}

export default createUseComponent(() => {
  const backdrop = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const deviceInfo = Bowser.parse(window.navigator.userAgent)

  const handleClose = () => {
    setOpen(false)
    sessionStorage.setItem(BROWSER_COMPATIBILITY_NOFIFICATION, 'hide')
  }

  const handleBackdropClick = (
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (backdrop.current && e.target === backdrop.current) {
      handleClose()
    }
  }

  useEffect(() => {
    const isCompatibilityHide = sessionStorage.getItem(
      BROWSER_COMPATIBILITY_NOFIFICATION,
    )

    if (
      !isCompatibilityHide &&
      typeof deviceInfo.os.name === 'string' &&
      typeof deviceInfo.browser.name === 'string' &&
      compatibleBrowsers[deviceInfo.os.name] &&
      !compatibleBrowsers[deviceInfo.os.name].includes(deviceInfo.browser.name)
    ) {
      setOpen(true)
    }
  }, [])

  return {
    refs: { backdrop },
    data: { deviceInfo, open },
    handlers: { handleBackdropClick, handleClose },
  }
})
