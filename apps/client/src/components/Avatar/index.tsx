import { useState } from 'react'
import cn from 'classnames'

import UserSvg from '@qc/icons/contents/contact.svg'
import { useBlobToUrl } from '../../hooks'
import './styles.css'

interface AvatarProps {
  blob?: Blob
  className?: string
  onError?: () => void
}

export default function Avatar({ blob, className, onError }: AvatarProps) {
  const [isError, setIsError] = useState(false)
  const url = useBlobToUrl(blob)

  const handleError = () => {
    setIsError(true)

    if (onError) {
      onError()
    }
  }

  return (
    <div className={cn('avatar', className)}>
      {url && !isError ? (
        <img
          alt="Avatar"
          className="avatar-img"
          src={url}
          onError={handleError}
        />
      ) : (
        <UserSvg className="avatar-icon" />
      )}
    </div>
  )
}
