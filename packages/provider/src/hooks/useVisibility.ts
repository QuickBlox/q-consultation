import { useState, useEffect } from 'react'

export default function useVisibility() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const updateVisibility = () => setVisible(document.hidden !== true)

    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)

    return () =>
      document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  return visible
}
