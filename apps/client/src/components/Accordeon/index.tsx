import { PropsWithChildren, ReactNode } from 'react'
import cn from 'classnames'

import ChevronRightSvg from '@qc/icons/navigation/next.svg'
import './styles.css'

interface AccordeonProps {
  open: boolean
  title: string
  onClick?: VoidFunction
  renderControls?: () => ReactNode
}

export default function Accordeon(props: PropsWithChildren<AccordeonProps>) {
  const { open, onClick, title, renderControls, children } = props

  return (
    <div className={cn('accordeon', { active: open })}>
      <button type="button" className="title" onClick={onClick}>
        <span>{title}</span>
        <div className="btn-controls">
          {renderControls && renderControls()}
          <ChevronRightSvg className="icon arrow" />
        </div>
      </button>
      <div className="body">{children}</div>
    </div>
  )
}
