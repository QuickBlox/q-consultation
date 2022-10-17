import { components, ContainerProps } from 'react-select'
import cn from 'classnames'

const { SelectContainer: Container } = components

export default function SelectContainer<T>({
  children,
  ...props
}: ContainerProps<OptionType<T>, false>) {
  return (
    <Container
      {...props}
      className={cn(props.className, {
        'menu-is-open': props.selectProps.menuIsOpen,
        'is-focused': props.isFocused,
      })}
      isFocused
    >
      {children}
    </Container>
  )
}
