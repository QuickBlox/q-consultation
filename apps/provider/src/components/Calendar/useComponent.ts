import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ActiveModifiers, DayPickerProps } from 'react-day-picker'

import { createUseComponent } from '../../hooks'

export type CalendarProps = DayPickerProps & {
  className?: string
  selectedDays?: Date | Date[]
  isWeekly?: boolean
  small?: boolean
  position?: 'top' | 'bottom'
}

export default createUseComponent((props: CalendarProps) => {
  const { onDayClick } = props
  const [isShowOverlay, setIsShowOverlay] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const handleToggleShow = () => {
    setIsShowOverlay(!isShowOverlay)
  }

  const handleSelectDate = (
    day: Date,
    modifiers: ActiveModifiers,
    e: ReactMouseEvent,
  ) => {
    if (!modifiers.disabled) {
      if (onDayClick) onDayClick(day, modifiers, e)
      setIsShowOverlay(false)
    }
  }

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (
        e.target instanceof Node &&
        calendarRef.current &&
        !calendarRef.current?.contains(e.target)
      ) {
        setIsShowOverlay(false)
      }
    }

    if (isShowOverlay) {
      document.addEventListener('click', handleClose)
    }

    return () => {
      document.removeEventListener('click', handleClose)
    }
  }, [calendarRef, isShowOverlay])

  return {
    data: { isShowOverlay },
    refs: {
      calendarRef,
    },
    handlers: {
      handleToggleShow,
      handleSelectDate,
    },
  }
})
