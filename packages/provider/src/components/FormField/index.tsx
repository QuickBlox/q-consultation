import { TFunctionResult } from 'i18next'
import { LabelHTMLAttributes, PropsWithChildren } from 'react'
import cn from 'classnames'

import { InfoSvg } from '../../icons'
import './styles.css'

interface FormFieldProps {
  htmlFor?: LabelHTMLAttributes<HTMLLabelElement>['htmlFor']
  className?: string
  label?: string
  hint?: string | string[]
  error?: boolean | string | null | TFunctionResult
  inline?: boolean
}

export default function FormField(props: PropsWithChildren<FormFieldProps>) {
  const { className, htmlFor, children, label, hint, error, inline } = props

  return (
    <div className={cn('form-field', className, { inline })}>
      <div className="form-field-label">
        {label && (
          <label htmlFor={htmlFor} className="form-field-label-text">
            {label}
          </label>
        )}
        {hint && (
          <div className="form-field-tooltip">
            <InfoSvg className="icon info" />
            <div className="form-field-tooltip-body tooltip-bottom-end">
              {Array.isArray(hint) ? (
                <ul>
                  {hint.map((text, index) => (
                    <li key={index}>{text}</li>
                  ))}
                </ul>
              ) : (
                hint
              )}
            </div>
          </div>
        )}
      </div>
      <div className="field-container">{children}</div>
      {error && <div className="form-field-error">{error}</div>}
    </div>
  )
}
