import {
  ChangeEvent,
  DetailedHTMLProps,
  FocusEvent,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import {
  ActiveModifiers,
  CaptionProps,
  DayPicker,
  DayPickerProps,
} from 'react-day-picker'
import { format, parse } from 'date-fns'
import { DATE_INPUT_FORMAT } from '@qc/template/dateFormat'

import CalendarSvg from '@qc/icons/contents/calendar.svg'
import { CalendarCaption } from '../Calendar/CalendarCaption'
import { isMatchFormat } from '../../utils/calendar'
import { dayPickerLocale } from '../../utils/locales'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type DateInputProps = Omit<
  DayPickerProps,
  | 'showOutsideDays'
  | 'locale'
  | 'components'
  | 'selected'
  | 'onDayClick'
  | 'mode'
> & {
  className?: string
  inputProps?: HTMLInputProps
  small?: boolean
  hideYear?: boolean
  position?: 'top' | 'bottom'
  format?: string
  valueFormat?: string
  placeholder?: string
  value?: string | Date
  onDayChange?: (day?: Date, inputValue?: string) => void
}

export default function DateInput(props: DateInputProps) {
  const {
    className,
    inputProps,
    small,
    value,
    valueFormat,
    onDayChange,
    format: customDateFormat,
    placeholder,
    hideYear,
    position = 'bottom',
    ...dayPickerProps
  } = props
  const [isFocus, setIsFocus] = useState(false)
  const { i18n } = useTranslation()
  const fieldRef = useRef<HTMLDivElement>(null)

  const dateFormat: string =
    // @ts-ignore
    customDateFormat ?? DATE_INPUT_FORMAT[i18n.language]
  const dateLocale = { locale: dayPickerLocale[i18n.language] }

  const getParsedValue = () => {
    if (value instanceof Date) {
      return value
    }

    if (value) {
      return parse(value, valueFormat || dateFormat, new Date())
    }

    return undefined
  }

  const [inputValue, setInputValue] = useState<string | Date>(
    getParsedValue() || '',
  )
  const [selected, setSelected] = useState<Date | undefined>(getParsedValue())

  const handleSelectDate = (day: Date, modifiers: ActiveModifiers) => {
    if (!modifiers.disabled) {
      if (onDayChange) {
        onDayChange(day)
      }
      setInputValue(day)
      setSelected(day)
      setIsFocus(false)
    }
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: targetValue } = e.target

    if (onDayChange) {
      if (isMatchFormat(targetValue, dateFormat, i18n.language)) {
        const parsedDate = parse(
          targetValue,
          dateFormat,
          new Date(),
          dateLocale,
        )

        setSelected(parsedDate)
        setInputValue(parsedDate)
        onDayChange(parsedDate)
      } else {
        onDayChange(undefined, targetValue)
        setSelected(undefined)
        setInputValue(targetValue)
      }
    }
  }

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (
        e.target instanceof Node &&
        fieldRef.current &&
        !fieldRef.current?.contains(e.target)
      ) {
        setIsFocus(false)
      }
    }

    if (isFocus) {
      document.addEventListener('click', handleClose)
    }

    return () => {
      document.removeEventListener('click', handleClose)
    }
  }, [fieldRef, isFocus])

  useEffect(() => {
    if (!value) {
      setInputValue('')
      setSelected(undefined)
    } else {
      const parsedValue = getParsedValue()

      setInputValue(parsedValue || '')
      setSelected(parsedValue)
    }
  }, [value])

  const renderCalendarCaption = (captionProps: CaptionProps) => (
    <CalendarCaption
      {...captionProps}
      labelFormat={hideYear ? 'MMMM' : undefined}
    />
  )

  return (
    <div
      className={cn(
        'field flex-field date-field date-input',
        className,
        position,
        {
          'date-field--focus': isFocus,
          'date-field-sm': small,
        },
      )}
      ref={fieldRef}
    >
      <input
        {...inputProps}
        placeholder={placeholder || format(new Date(), dateFormat, dateLocale)}
        onFocus={(e: FocusEvent<HTMLInputElement>) => {
          if (props.inputProps?.onFocus) {
            props.inputProps?.onFocus(e)
          }
          setIsFocus(true)
        }}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          if (
            (!e.relatedTarget ||
              (e.relatedTarget instanceof Node &&
                !fieldRef.current?.contains(e.relatedTarget))) &&
            props.inputProps?.onBlur
          ) {
            props.inputProps?.onBlur(e)
          }
        }}
        value={
          inputValue instanceof Date
            ? format(inputValue, dateFormat, dateLocale)
            : inputValue
        }
        onChange={handleChangeInput}
      />
      {isFocus && (
        <div className="DayPickerInput-OverlayWrapper">
          <div className="DayPickerInput-Overlay">
            <DayPicker
              {...dayPickerProps}
              showOutsideDays
              locale={dayPickerLocale[i18n.language]}
              components={{
                Caption: renderCalendarCaption,
              }}
              selected={selected}
              onDayClick={handleSelectDate}
            />
          </div>
        </div>
      )}
      <label htmlFor={inputProps?.id || ''}>
        <CalendarSvg className="icon" />
      </label>
    </div>
  )
}
