import {
  MouseEvent as ReactMouseEvent,
  FocusEvent,
  useState,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react'
import cn from 'classnames'

import { DropdownSvg } from '../../icons'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

interface SelectProps extends Omit<HTMLInputProps, 'onChange' | 'type'> {
  options: Array<{ label: string; value: string | number }>
  onChange: (value: string | number) => void
}

export default function Select(props: SelectProps) {
  const { className, options, onChange, ...inputProps } = props
  const [isFocus, setIsFocus] = useState(false)
  const [isShowOptions, setIsShowOptions] = useState(false)
  const selected = options.find(({ value }) => value === props.value)

  const handleToggleShow = () => {
    setIsShowOptions(!isShowOptions)
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (inputProps?.onFocus) {
      inputProps?.onFocus(e)
    }
    setIsFocus(true)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (inputProps?.onBlur) {
      inputProps?.onBlur(e)
    }
    setIsFocus(false)
  }

  const handleSelect = (
    e: ReactMouseEvent<HTMLUListElement | HTMLLIElement, MouseEvent>,
  ) => {
    e.stopPropagation()
    const { dataset } = e.target as EventTarget & {
      dataset: { value?: string }
    }

    if (dataset.value) {
      onChange(dataset.value)
      setIsShowOptions(false)
    }
  }

  // TODO: add tab control
  return (
    <div
      // role="combobox"
      aria-haspopup="listbox"
      // aria-owns="select-field-list"
      aria-expanded={isShowOptions}
      className={cn('field select-field', className, {
        'select-field--focus': isFocus,
      })}
      onClick={handleToggleShow}
    >
      <div className="flex-field">
        <input
          {...inputProps}
          readOnly
          aria-autocomplete="list"
          aria-controls="select-field-list"
          className={cn('flex-field-input', { hidden: selected })}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {selected && (
          <span className="select-field-label">{selected?.label}</span>
        )}
        <DropdownSvg className="icon" />
      </div>
      {isShowOptions && (
        <ul
          role="listbox"
          id="select-field-list"
          className="select-field-list"
          onClick={handleSelect}
        >
          {options.map((option) => (
            <li
              key={option.value}
              tabIndex={-1}
              className="select-field-option"
              role="option"
              data-value={option.value}
              aria-selected={option.value === inputProps.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
