import { components, MenuProps } from 'react-select'
import cn from 'classnames'

import Loader from '../Loader'

const { Menu: Dropdown } = components

export default function Menu<T>(props: MenuProps<OptionType<T>, false>) {
  return (
    <Dropdown {...props}>
      <Loader
        className={cn({ active: props.selectProps.isLoading })}
        theme="primary"
      />
      {props.children}
    </Dropdown>
  )
}
