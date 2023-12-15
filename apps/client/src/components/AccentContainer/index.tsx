import {
  cloneElement,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  useRef,
} from 'react'
import './styles.css'

interface AccentContainerProps {
  active?: boolean
  onClose?: () => void
  children: ReactElement
}

export default function AccentContainer(props: AccentContainerProps) {
  const { active, children, onClose } = props
  const backdropRef = useRef<HTMLDivElement>(null)

  const onBackdropClick = ({
    target,
  }: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onClose && target === backdropRef?.current) {
      onClose()
    }
  }

  if (active) {
    return (
      <>
        <div
          className="accent-container"
          onClick={onBackdropClick}
          ref={backdropRef}
        />
        {cloneElement(children, {
          style: { zIndex: 4 },
        })}
      </>
    )
  }

  return children
}
