import cn from 'classnames'

import DropdownSvg from '@qc/icons/navigation/dropdown.svg'
import useComponent, { TimeInputProps } from './useComponent'

export default function TimeInput(props: TimeInputProps) {
  const { className, id, name } = props
  const {
    refs: { inputRef },
    data: { isFocus, validatedValue },
    handlers: { handleFocus, handleBlur, handleChange, addStep, subtractStep },
  } = useComponent(props)

  return (
    <div
      className={cn('field time-field', className, {
        'time-field--focus': isFocus,
      })}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <input
        className="time-input"
        id={id}
        name={name}
        value={validatedValue}
        onInput={handleChange}
        ref={inputRef}
      />
      <div className="time-field-controls">
        <button type="button" className="tfc-btn" onClick={addStep}>
          <DropdownSvg className="icon" />
        </button>
        <button type="button" className="tfc-btn" onClick={subtractStep}>
          <DropdownSvg className="icon" />
        </button>
      </div>
    </div>
  )
}
