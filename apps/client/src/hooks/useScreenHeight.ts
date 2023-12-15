import { useState, useEffect } from 'react'
import { debounce } from 'lodash'

export default function useScreenHeight() {
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    const callback = () => {
      setHeight(window.innerHeight)
    }
    const updateHeight = debounce(callback, 300)

    window.addEventListener('onorientationchange', updateHeight)
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('onorientationchange', updateHeight)
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return height
}
