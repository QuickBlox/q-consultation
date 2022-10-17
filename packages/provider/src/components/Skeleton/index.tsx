import cn from 'classnames'

import './styles.css'

export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export default function Skeleton({
  className,
  variant = 'text',
}: SkeletonProps) {
  return <span className={cn('skeleton pulse', variant, className)} />
}
