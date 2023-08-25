import { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import cn from 'classnames'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

interface InputProps extends HTMLInputProps {
  type: 'email' | 'number' | 'password' | 'search' | 'text' | 'url'
}

export default function Input({ className, ...props }: InputProps) {
  return <input className={cn('field', className)} {...props} />
}
