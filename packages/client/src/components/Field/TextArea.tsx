import { DetailedHTMLProps, TextareaHTMLAttributes } from 'react'
import cn from 'classnames'

type HTMLTextAreaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

export default function TextArea(props: HTMLTextAreaProps) {
  const { value, maxLength, className } = props

  return (
    <div className={cn('textarea-wrapper', className)}>
      <textarea {...props} className="field" />
      {maxLength && maxLength > 0 && (
        <span className="textarea-length">{`${
          value?.toString().length || 0
        }/${maxLength}`}</span>
      )}
    </div>
  )
}
