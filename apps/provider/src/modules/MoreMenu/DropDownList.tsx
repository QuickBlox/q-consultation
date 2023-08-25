import { RefObject } from 'react'
import cn from 'classnames'

export interface Option<T, V> {
  label: T
  value?: V
  className?: string
}

interface DropDownListProps<T, V> {
  active?: boolean
  menuRef?: RefObject<HTMLDivElement>
  items: Array<Option<T, V>>
  onSelect?: (option: Option<T, V>) => void
}

export default <T, V>(props: DropDownListProps<T, V>) => {
  const { active, menuRef, items } = props

  const getItemSelectHandler = (item: Option<T, V>) => () => {
    if (props.onSelect && item.value) {
      props.onSelect(item)
    }
  }

  return (
    <div className={cn('menu-list', { active })} ref={menuRef}>
      {items.map((item, i) => (
        <div
          className={cn(item.className, { 'menu-option': !item.className })}
          key={`${i}-${
            typeof item?.value === 'number' || typeof item?.value === 'string'
              ? item?.value
              : ''
          }`}
          onClick={getItemSelectHandler(item)}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
