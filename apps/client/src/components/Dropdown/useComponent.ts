import { PropsWithChildren, useEffect, useRef, useState } from 'react'

import { createUseComponent } from '../../hooks'

interface Option {
  label?: string
  value?: string
  divider?: boolean
  path?: string
  onClick?: VoidFunction
  hide?: boolean
}

export type DropdownProps = PropsWithChildren<{
  className?: string
  value?: Option['value']
  options: Array<Option>
  onSelect?: (value: Exclude<Option['value'], undefined>) => void
  disabled?: boolean
}>

export default createUseComponent((props: DropdownProps) => {
  const { onSelect, disabled } = props
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectCreator = (option: Option) => () => {
    if (!disabled) {
      if (option.onClick) {
        option.onClick()
      } else if (onSelect && option.value) {
        onSelect(option.value)
      }
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleBlur = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) document.addEventListener('click', handleBlur)

    return () => document.removeEventListener('click', handleBlur)
  }, [isOpen])

  return {
    refs: { dropdownRef },
    data: { isOpen, disabled },
    handlers: {
      handleToggleOpen,
      handleSelectCreator,
    },
  }
})
