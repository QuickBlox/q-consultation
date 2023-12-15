import { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import cn from 'classnames'

import CheckSvg from '@qc/icons/toggle/check-on.svg'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

interface CheckboxProps extends Omit<HTMLInputProps, 'type'> {
  label: string
}

export default function Checkbox(props: CheckboxProps) {
  const { className, label, ...inputProps } = props

  return (
    <label className={cn('checkbox-field', className)}>
      {inputProps.checked && <CheckSvg className="icon-check" />}
      <input type="checkbox" {...inputProps} />
      <span>{label}</span>
    </label>
  )
}
