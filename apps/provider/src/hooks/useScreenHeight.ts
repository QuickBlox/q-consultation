import { useState, useEffect } from 'react'
import debounce from 'lodash/debounce'

export default function useScreenHeight() {
  const [heigth, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    const callback = () => {
      setHeight(window.innerHeight)
    }
    const updateHeight = debounce(callback, 100)

    window.addEventListener('onorientationchange', updateHeight)
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('onorientationchange', updateHeight)
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return heigth
}
