import { PropsWithChildren, ReactNode } from 'react'
import cn from 'classnames'

import { ChevronRightSvg } from '../../icons'
import './styles.css'

interface AccordeonProps {
  open: boolean
  title: string
  className?: string
  onClick?: VoidFunction
  renderControls?: () => ReactNode
}

export default function Accordeon(props: PropsWithChildren<AccordeonProps>) {
  const { open, onClick, title, className, renderControls, children } = props

  return (
    <div className={cn('section-item', className, { active: open })}>
      <button type="button" className="title" onClick={onClick}>
        <span>{title}</span>
        <div className="icon-container">
          {renderControls && renderControls()}
          <ChevronRightSvg className="icon arrow" />
        </div>
      </button>
      <div className="body">{children}</div>
    </div>
  )
}
