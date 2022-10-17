import {
  Children,
  isValidElement,
  cloneElement,
  FunctionComponent,
  PropsWithChildren,
  ReactElement,
  Ref,
} from 'react'
import cn from 'classnames'

import Tab, { TabProps } from './Tab'
import './styles.css'

type TabComponent = FunctionComponent<{
  ref?: Ref<HTMLButtonElement>
  name: string
  title: string
  className?: string
  disabled?: boolean
}>

interface TabsProps<V> {
  value: V
  onChange?: (value: V) => void
  children:
    | Array<ReactElement<PropsWithChildren<TabProps<V>>> | null | boolean>
    | ReactElement<PropsWithChildren<TabProps<V>>>
}

function Tabs<V extends string>({
  value: activeName,
  onChange,
  children,
}: TabsProps<V>) {
  return (
    <div className="tabs">
      <div className="tabs-container">
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              activeName,
              onChange,
            })
          }

          return null
        })}
      </div>
      <div className="tab-content">
        {Children.map(children, (child) => {
          if (typeof child === 'boolean' || child === null) return null
          const { name, className, children: tabContent } = child.props

          return (
            <div
              className={cn('tab-content-item', className, {
                active: activeName === name,
              })}
            >
              {tabContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}

Tabs.Tab = Tab as unknown as TabComponent

export default Tabs
