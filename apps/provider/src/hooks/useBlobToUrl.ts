import { useState, useEffect } from 'react'

export default function useBlobToUrl(blob?: Blob) {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    if (!url && blob) {
      setUrl(URL.createObjectURL(blob))
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
        setUrl(undefined)
      }
    }
  }, [blob, url])

  return url
}
