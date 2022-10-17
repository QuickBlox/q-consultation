import { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import cn from 'classnames'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

interface RadioProps extends Omit<HTMLInputProps, 'type'> {
  label: string
}

export default function Radio(props: RadioProps) {
  const { className, label, ...inputProps } = props

  return (
    <label className={cn('radio-field', className)}>
      <input type="radio" {...inputProps} />
      <span>{label}</span>
    </label>
  )
}
