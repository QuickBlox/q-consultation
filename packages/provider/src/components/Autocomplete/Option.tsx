import { OptionProps, components } from 'react-select'

import { CheckSvg } from '../../icons'

const { Option: DropdownOption } = components

export default function Option<T>(props: OptionProps<OptionType<T>, false>) {
  return (
    <DropdownOption {...props}>
      {props.label}
      {props.isSelected && <CheckSvg className="icon check" />}
    </DropdownOption>
  )
}
