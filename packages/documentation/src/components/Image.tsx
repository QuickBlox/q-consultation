import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

interface ImageProps {
  src: string
  caption?: string
}

export default function Image({ src, caption }: ImageProps) {
  const url = useBaseUrl(src)

  return (
    <div className="image-wrapper">
      <img className="image" src={url} />
      {caption && <div className="image-caption">{caption}</div>}
    </div>
  )
}
