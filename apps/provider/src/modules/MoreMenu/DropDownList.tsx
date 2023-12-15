import cn from 'classnames'

export interface Option<T> {
  label: string
  value?: T
  className?: string
}

interface DropDownListProps<T> {
  active?: boolean
  items: Array<Option<T>>
  onSelect?: (option: Option<T>) => void
}

export default function DropDownList<T>(props: DropDownListProps<T>) {
  const { active, items } = props

  const getItemSelectHandler = (item: Option<T>) => () => {
    if (props.onSelect && item.value) {
      props.onSelect(item)
    }
  }

  return (
    <div className={cn('menu-list', { active })}>
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
