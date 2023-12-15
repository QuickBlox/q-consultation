import { PropsWithChildren, ReactNode } from 'react'
import cn from 'classnames'

import ChevronRightSvg from '@qc/icons/navigation/next.svg'
import './styles.css'

interface AccordeonProps {
  open: boolean
  disableCollapse?: boolean
  title: string
  className?: string
  onClick?: VoidFunction
  renderControls?: () => ReactNode
}

export default function Accordeon(props: PropsWithChildren<AccordeonProps>) {
  const {
    open,
    disableCollapse = false,
    onClick,
    title,
    className,
    renderControls,
    children,
  } = props

  return (
    <div className={cn('section-item', className, { active: open })}>
      <div
        className={cn('title', { disabled: disableCollapse })}
        onClick={!disableCollapse ? onClick : undefined}
      >
        <span>{title}</span>
        <div className="icon-container">
          {renderControls && renderControls()}
          {!disableCollapse && <ChevronRightSvg className="icon arrow" />}
        </div>
      </div>
      <div className="body">{children}</div>
    </div>
  )
}
