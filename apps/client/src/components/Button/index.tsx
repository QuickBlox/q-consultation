import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import cn from 'classnames'

import Loader from '../Loader'
import './styles.css'

type HTMLButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export interface ButtonProps extends HTMLButtonProps {
  theme?: 'primary' | 'default'
  loading?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  mobileSize?: 'sm' | 'auto'
}

export default function Button(props: ButtonProps) {
  const {
    className,
    theme = 'default',
    size = 'md',
    mobileSize,
    loading,
    disabled,
    type,
    children,
    ...buttonProps
  } = props

  return (
    <button
      {...buttonProps}
      // eslint-disable-next-line react/button-has-type
      type={type || 'button'}
      disabled={disabled || loading}
      className={cn(
        `button button-${disabled ? 'disabled' : theme} button-${size}`,
        mobileSize && `m-button-${mobileSize}`,
        className,
      )}
    >
      {loading ? (
        <Loader theme={theme === 'default' ? 'default' : 'secondary'} />
      ) : (
        children
      )}
    </button>
  )
}
