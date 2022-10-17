import {
  cloneElement,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  useRef,
} from 'react'
import cn from 'classnames'

import './styles.css'

interface AccentContainerProps {
  active?: boolean
  onClose?: () => void
  children: ReactElement
}

export default function AccentContainer(props: AccentContainerProps) {
  const { active, children, onClose } = props
  const backdrop = useRef<HTMLDivElement>(null)

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current && onClose) {
      onClose()
    }
  }

  return (
    <>
      <div
        className={cn('modal accent', { active })}
        onClick={onBackdropClick}
        ref={backdrop}
      />
      {active
        ? cloneElement(children, {
            style: { zIndex: 4 },
          })
        : children}
    </>
  )
}
