import { useRef } from 'react'
import cn from 'classnames'

import Loader from '../Loader'
import './styles.css'

interface FlatListProps<T> {
  className?: string
  data: Array<T>
  ListEmptyComponent?: React.ComponentClass | React.FunctionComponent
  onEndReached?: VoidFunction
  onEndReachedThreshold?: number
  refreshing?: boolean
  renderItem: (item: T, index: number) => React.ReactElement | null
}

export default function FlatList<T>(props: FlatListProps<T>) {
  const {
    className,
    data,
    ListEmptyComponent,
    onEndReached,
    onEndReachedThreshold,
    refreshing,
    renderItem,
  } = props

  const container = useRef<HTMLDivElement>(null)

  const scrollHandler = () => {
    if (container.current) {
      const { scrollHeight, clientHeight, scrollTop } = container.current
      const scrollOffset = (scrollTop + clientHeight) / scrollHeight
      let endReached = false

      if (typeof onEndReachedThreshold === 'number') {
        if (scrollOffset >= onEndReachedThreshold) {
          endReached = true
        }
      } else if (scrollOffset >= 0.99) {
        endReached = true
      }

      if (endReached && onEndReached) {
        onEndReached()
      }
    }
  }

  return (
    <div className={cn('list', className)}>
      <Loader className={cn({ active: refreshing })} theme="primary" />
      {data.length ? (
        <div className="list-content" onScroll={scrollHandler} ref={container}>
          {data.map(renderItem)}
        </div>
      ) : (
        !refreshing && ListEmptyComponent && <ListEmptyComponent />
      )}
    </div>
  )
}
