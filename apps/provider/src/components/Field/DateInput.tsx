import {
  DetailedHTMLProps,
  FocusEvent,
  InputHTMLAttributes,
  useRef,
  useState,
} from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DayPickerInputProps } from 'react-day-picker/types/Props'
import MomentLocaleUtils from 'react-day-picker/moment'
import cn from 'classnames'

import { CalendarSvg, ChevronRightSvg } from '../../icons'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

interface DateInputProps extends DayPickerInputProps {
  className?: string
  inputProps?: HTMLInputProps
  small?: boolean
  hideYear?: boolean
}

export default function DateInput(props: DateInputProps) {
  const {
    className,
    format,
    placeholder,
    inputProps,
    dayPickerProps,
    small,
    hideYear,
  } = props
  const [isFocus, setIsFocus] = useState(false)
  const { i18n } = useTranslation()
  const fieldRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn('field flex-field date-field', className, {
        'date-field--focus': isFocus,
        'date-field-sm': small,
      })}
      ref={fieldRef}
    >
      <DayPickerInput
        formatDate={MomentLocaleUtils.formatDate}
        parseDate={MomentLocaleUtils.parseDate}
        format={format || 'L'}
        placeholder={
          placeholder ||
          MomentLocaleUtils.formatDate(new Date(), 'L', i18n.language)
        }
        {...props}
        inputProps={{
          ...inputProps,
          onFocus: (e: FocusEvent<HTMLInputElement>) => {
            if (props.inputProps?.onFocus) {
              props.inputProps?.onFocus(e)
            }
            setIsFocus(true)
          },
          onBlur: (e: FocusEvent<HTMLInputElement>) => {
            if (
              !e.relatedTarget ||
              (e.relatedTarget instanceof Node &&
                !fieldRef.current?.contains(e.relatedTarget))
            ) {
              if (props.inputProps?.onBlur) {
                props.inputProps?.onBlur(e)
              }
              setIsFocus(false)
            }
          },
        }}
        dayPickerProps={{
          showOutsideDays: true,
          locale: i18n.language,
          localeUtils: MomentLocaleUtils,
          navbarElement: (navProps) => (
            <div className="DayPicker-Nav">
              <button
                type="button"
                className={cn('DayPicker-Nav-btn', {
                  hide: !navProps.showPreviousButton,
                })}
                onClick={() => navProps.onPreviousClick()}
              >
                <ChevronRightSvg className="nav-icon nav-icon-prev" />
              </button>
              <span>
                {moment(navProps.month).format(
                  hideYear ? 'MMMM' : 'MMMM, YYYY',
                )}
              </span>
              <button
                type="button"
                className={cn('DayPicker-Nav-btn', {
                  hide: !navProps.showNextButton,
                })}
                onClick={() => navProps.onNextClick()}
              >
                <ChevronRightSvg className="nav-icon nav-icon-next" />
              </button>
            </div>
          ),
          renderDay: (day) => (
            <span className="DayPicker-Day-Item">
              {moment(day).format('D')}
            </span>
          ),
          ...dayPickerProps,
        }}
      />
      <label htmlFor={inputProps?.id || ''}>
        <CalendarSvg className="icon" />
      </label>
    </div>
  )
}
