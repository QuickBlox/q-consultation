import cn from 'classnames'

import PlusSvg from '@qc/icons/navigation/plus.svg'
import DeleteSvg from '@qc/icons/actions/delete.svg'
import './styles.css'

interface ListOrganizerProps<T> {
  className?: string
  classNameItem?: string
  classNameContentItem?: string
  classNameControlsItem?: string
  items: Array<T>
  renderItem: (item: T, index: number) => JSX.Element
  onDelete: (index: number) => void
  onAdd: (index: number) => void
}

export default function ListOrganizer<T>(props: ListOrganizerProps<T>) {
  const {
    className,
    classNameItem,
    classNameContentItem,
    classNameControlsItem,
    items,
    renderItem,
    onDelete,
    onAdd,
  } = props

  return (
    <div className={cn('list-organizer', className)}>
      {items.map((item, index) => (
        <div key={index} className={cn('list-item', classNameItem)}>
          <div className={cn('list-item-content', classNameContentItem)}>
            {renderItem(item, index)}
          </div>
          <div className={cn('list-item-controls', classNameControlsItem)}>
            <button
              type="button"
              className="btn btn-delete"
              onClick={() => onDelete(index)}
            >
              <DeleteSvg className="icon" />
            </button>
            <button
              type="button"
              className="btn btn-add"
              onClick={() => onAdd(index)}
            >
              <PlusSvg className="icon" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
