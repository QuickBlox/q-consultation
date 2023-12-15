import { ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import throttle from 'lodash/throttle'

import { createUseComponent, usePrevious } from '../../hooks'

export interface SectionItem<T> {
  // Title for section
  title: string
  // List of section elements
  data: Dictionary<T[]>
}

export interface SectionListProps<T> {
  // Class name to add for SectionList DOM element
  className?: string
  // Set this true while waiting for new data from a refresh.
  refreshing?: boolean
  // Set to true to scroll down the list the first time you open it
  resetScroll?: boolean
  // An array of objects with data for each section.
  sections: ReadonlyArray<SectionItem<T>>
  // Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
  onEndReached: VoidFunction
  /**
   * How far from the end (in units of visible length of the list) the bottom edge of the
   * list must be from the end of the content to trigger the `onEndReached` callback.
   * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
   * within half the visible length of the list.
   */
  onEndReachedThreshold?: number
  // Default renderer for every item in every section. Can be over-ridden on a per-section basis.
  renderItem: (
    item: [string, T[]],
    listRef: RefObject<HTMLDivElement>,
  ) => ReactNode
  // Rendered at the top of each section.
  renderSectionHeader?: (section: SectionItem<T>) => ReactNode
  // Rendered at the bottom of each section.
  renderSectionFooter?: (section: SectionItem<T>) => ReactNode
}

export default createUseComponent(<T>(props: SectionListProps<T>) => {
  const { resetScroll, onEndReached, onEndReachedThreshold = 0.99 } = props
  const listContentRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const prevScrollHeight =
    usePrevious(listContentRef.current?.scrollHeight) || 0

  const scrollHandler = throttle(() => {
    if (listContentRef.current) {
      const { clientHeight, scrollTop } = listContentRef.current
      const scrollOffset = scrollTop / clientHeight

      if (scrollOffset <= onEndReachedThreshold && onEndReached) {
        onEndReached()
      }
    }
  }, 300)

  useEffect(() => {
    if (resetScroll) {
      setIsScrolled(false)
    }
  }, [resetScroll])

  useEffect(() => {
    if (
      listContentRef.current &&
      listContentRef.current.scrollHeight > listContentRef.current.clientHeight
    ) {
      const { scrollHeight, scrollTop, clientHeight } = listContentRef.current
      const positionFromBottom = prevScrollHeight - clientHeight - scrollTop

      if (
        !isScrolled ||
        (scrollHeight > prevScrollHeight &&
          positionFromBottom >= 0 &&
          positionFromBottom < 30)
      ) {
        listContentRef.current.scrollTo({
          top: scrollHeight,
          behavior: isScrolled ? 'smooth' : 'auto',
        })
        setIsScrolled(true)
      }
    }
  })

  return {
    refs: { listContentRef },
    handlers: { scrollHandler },
  }
})
