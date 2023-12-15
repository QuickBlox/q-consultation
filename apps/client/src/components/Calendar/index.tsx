import { useTranslation } from 'react-i18next'
import { DayPicker } from 'react-day-picker'
import cn from 'classnames'

import CalendarSvg from '@qc/icons/contents/calendar.svg'
import useComponent, { CalendarProps } from './useComponent'
import { dayPickerLocale } from '../../utils/locales'
import { CalendarCaption } from './CalendarCaption'
import './styles.css'

export default function Calendar(props: CalendarProps) {
  const { className, small, ...dayPickerProps } = props
  const {
    data: { isShowOverlay },
    refs: { calendarRef },
    handlers: { handleSelectDate, handleToggleShow },
  } = useComponent(props)
  const { i18n } = useTranslation()

  return (
    <div
      className={cn('calendar field date-field', className, {
        'show-overlay': isShowOverlay,
        'date-field-sm': small,
      })}
      ref={calendarRef}
    >
      <CalendarSvg className="icon" onClick={handleToggleShow} />
      {isShowOverlay && (
        <div className="DayPickerInput-OverlayWrapper" tabIndex={0}>
          <div className="DayPickerInput-Overlay">
            <DayPicker
              {...dayPickerProps}
              locale={dayPickerLocale[i18n.language]}
              showOutsideDays
              components={{ Caption: CalendarCaption }}
              onDayClick={handleSelectDate}
            />
          </div>
        </div>
      )}
    </div>
  )
}
