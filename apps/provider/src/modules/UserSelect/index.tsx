import Autocomplete from '../../components/Autocomplete'
import useComponent, { UserSelectProps } from './useComponent'

export default function UserSelect(props: UserSelectProps) {
  const { inputId } = props
  const {
    data: { selected },
    handlers: { selectOption, loadOptions },
  } = useComponent(props)

  return (
    <Autocomplete
      inputId={inputId}
      selected={selected}
      selectOption={selectOption}
      loadOptions={loadOptions}
    />
  )
}
