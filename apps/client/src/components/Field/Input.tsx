import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react'
import cn from 'classnames'
import PassHidden from '@qc/icons/toggle/hide.svg'
import PassVisible from '@qc/icons/toggle/show.svg'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

interface InputProps extends HTMLInputProps {
  type: 'email' | 'number' | 'password' | 'search' | 'text' | 'url'
}

export default function Input({ className, type, ...props }: InputProps) {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <div className="field-wrapper">
      <input
        type={isHidden ? type : 'text'}
        className={cn('field', className)}
        {...props}
      />
      {type === 'password' && (
        <div className="icon" onClick={() => setIsHidden(!isHidden)}>
          {isHidden ? <PassHidden /> : <PassVisible />}
        </div>
      )}
    </div>
  )
}
