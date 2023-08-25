import cn from 'classnames'

import { UserSvg } from '../../icons'
import './styles.css'

interface AvatarProps {
  url?: string
  className?: string
}

export default function Avatar({ url, className }: AvatarProps) {
  return (
    <div className={cn('avatar', className)}>
      {url ? (
        <img alt="Avatar" className="avatar-img" src={url} />
      ) : (
        <UserSvg className="avatar-icon" />
      )}
    </div>
  )
}
