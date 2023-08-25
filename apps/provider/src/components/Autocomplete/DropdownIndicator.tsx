import { components, DropdownIndicatorProps } from 'react-select'

import { DropdownSvg } from '../../icons'

const { DropdownIndicator: Indicator } = components

export default function DropdownIndicator<T>(
  props: DropdownIndicatorProps<OptionType<T>, false>,
) {
  return (
    <Indicator {...props}>
      <DropdownSvg className="icon arrow" />
    </Indicator>
  )
}
