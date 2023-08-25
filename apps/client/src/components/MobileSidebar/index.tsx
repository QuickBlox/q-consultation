import { PropsWithChildren } from 'react'
import cn from 'classnames'

import Modal from '../Modal'

import './styles.css'

export interface MobileSidebarProps {
  className?: string
  position: 'left' | 'right'
  open: boolean
  onClose: VoidFunction
}

export default function MobileSidebar(
  props: PropsWithChildren<MobileSidebarProps>,
) {
  const { className, position, open, onClose, children } = props

  return (
    <Modal>
      <div className={cn('sidebar-wrapper d-hidden', { open })}>
        <aside className={cn(`sidebar-content sidebar-${position}`, className)}>
          {children}
        </aside>
        <div className="sidebar-background" onClick={onClose} />
      </div>
    </Modal>
  )
}
