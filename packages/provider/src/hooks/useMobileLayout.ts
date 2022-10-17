import { useState, useLayoutEffect } from 'react'

const isMobileScreen = () => window.innerWidth < 769

export default function useMobileLayout() {
  const [isMobile, setIsMobile] = useState(isMobileScreen())

  useLayoutEffect(() => {
    function updateIsMobile() {
      setIsMobile(isMobileScreen())
    }
    window.addEventListener('resize', updateIsMobile)

    return () => window.removeEventListener('resize', updateIsMobile)
  }, [])

  return isMobile
}
