import { forwardRef, PropsWithChildren, ForwardedRef } from 'react'
import cn from 'classnames'

export interface TabProps<V> {
  className?: string
  title: string
  name: V
  activeName: V
  onChange: (value: V) => void
}

function Tab<V extends string>(
  props: PropsWithChildren<TabProps<V>>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { className, name, activeName, title, onChange } = props

  return (
    <button
      type="button"
      className={cn('tab', className, { active: name === activeName })}
      onClick={() => onChange(name)}
      ref={ref}
    >
      {title}
    </button>
  )
}

export default forwardRef(Tab)
