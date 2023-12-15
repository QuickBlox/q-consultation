import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react'
import { format, addMinutes, parse, subMinutes } from 'date-fns'
import { TIME_FORMAT } from '@qc/template/dateFormat'
import { createUseComponent } from '../../../hooks'
import { isNumber, validateTimeAndCursor } from './utils'

export interface TimeInputProps {
  className?: string
  value?: string
  step?: number
  name?: string
  id?: string
  onChange: (value: string) => void
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void
}

export default createUseComponent((props: TimeInputProps) => {
  const { step = 5, value, onChange, onBlur } = props
  const [validatedValue] = validateTimeAndCursor(value)
  const [selection, setSelection] = useState(0)
  const [isFocus, setIsFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addStep = () => {
    if (validatedValue) {
      const time = format(
        addMinutes(parse(validatedValue, TIME_FORMAT, new Date()), step),
        TIME_FORMAT,
      )

      onChange(time)
    }
  }

  const subtractStep = () => {
    if (validatedValue) {
      const time = format(
        subMinutes(parse(validatedValue, TIME_FORMAT, new Date()), step),
        TIME_FORMAT,
      )

      onChange(time)
    }
  }

  const handleFocus = () => {
    setIsFocus(true)
  }

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (onBlur) {
      onBlur(e)
    }
    setIsFocus(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const oldValue = validatedValue
    const inputEl = e.target
    const inputString = inputEl.value
    const position = inputEl.selectionEnd || 0
    const formatLength = TIME_FORMAT.length

    if (!oldValue) {
      return
    }

    const isTyped = inputString.length > oldValue.length
    const cursorCharacter = inputString[position - 1]
    const addedCharacter = isTyped ? cursorCharacter : null
    const removedCharacter = isTyped ? null : oldValue[position]
    const replacedSingleCharacter =
      inputString.length === oldValue.length ? oldValue[position - 1] : null
    const colon = ':'

    let newValue = oldValue
    let newPosition = position

    if (addedCharacter !== null) {
      if (position > formatLength) {
        newPosition = formatLength
      } else if (
        (position === 3 || position === 6) &&
        addedCharacter === colon
      ) {
        newValue = `${inputString.substring(
          0,
          position - 1,
        )}${colon}${inputString.substring(position + 1)}`
      } else if (
        (position === 3 || position === 6) &&
        isNumber(addedCharacter)
      ) {
        newValue = `${inputString.substring(
          0,
          position - 1,
        )}${colon}${addedCharacter}${inputString.substring(position + 2)}`

        newPosition = position + 1
      } else if (isNumber(addedCharacter)) {
        // user typed a number
        newValue =
          inputString.substring(0, position - 1) +
          addedCharacter +
          inputString.substring(position + 1)

        if (position === 2 || position === 5) {
          newPosition = position + 1
        }
      } else {
        // if user typed NOT a number, then keep old value & position
        newPosition = position - 1
      }
    } else if (replacedSingleCharacter !== null) {
      // user replaced only a single character
      if (isNumber(cursorCharacter)) {
        if (position - 1 === 2 || position - 1 === 5) {
          newValue = `${inputString.substring(
            0,
            position - 1,
          )}${colon}${inputString.substring(position)}`
        } else {
          newValue = inputString
        }
      } else {
        // user replaced a number on some non-number character
        newValue = oldValue
        newPosition = position - 1
      }
    } else if (
      typeof cursorCharacter !== 'undefined' &&
      cursorCharacter !== colon &&
      !isNumber(cursorCharacter)
    ) {
      // set of characters replaced by non-number
      newValue = oldValue
      newPosition = position - 1
    } else if (removedCharacter !== null) {
      if ((position === 2 || position === 5) && removedCharacter === colon) {
        newValue = `${inputString.substring(
          0,
          position - 1,
        )}0${colon}${inputString.substring(position)}`
        newPosition = position - 1
      } else {
        // user removed a number
        newValue = `${inputString.substring(
          0,
          position,
        )}0${inputString.substring(position)}`
      }
    }

    const [validatedTime, validatedCursorPosition] = validateTimeAndCursor(
      newValue,
      oldValue,
      colon,
      newPosition,
    )

    setSelection(validatedCursorPosition)

    onChange(validatedTime)
  }

  useEffect(() => {
    inputRef?.current?.setSelectionRange(selection, selection)
  }, [selection])

  return {
    refs: { inputRef },
    data: { isFocus, validatedValue },
    handlers: { handleFocus, handleBlur, handleChange, addStep, subtractStep },
  }
})
