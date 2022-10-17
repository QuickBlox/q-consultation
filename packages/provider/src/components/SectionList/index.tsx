import cn from 'classnames'

import Loader from '../Loader'
import useComponent, { SectionItem, SectionListProps } from './useComponent'
import './styles.css'

export default function SectionList<T>(props: SectionListProps<T>) {
  const {
    className,
    refreshing,
    sections,
    renderSectionHeader,
    renderSectionFooter,
    renderItem,
  } = props
  const {
    refs: { listContentRef },
    handlers: { scrollHandler },
  } = useComponent(props)

  const renderSection = (section: SectionItem<T>) => (
    <div className="section" key={section.title}>
      {renderSectionHeader && renderSectionHeader(section)}
      {section.data.map(renderItem)}
      {renderSectionFooter && renderSectionFooter(section)}
    </div>
  )

  return (
    <div className={cn('section-list', className)}>
      <Loader theme="primary" className={cn({ active: refreshing })} />
      <div
        className="list-content"
        onScroll={scrollHandler}
        ref={listContentRef}
      >
        {sections.length > 0 && sections.map(renderSection)}
      </div>
    </div>
  )
}
