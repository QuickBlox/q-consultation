import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SingleValue, GroupBase } from 'react-select'
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate'

import Option from './Option'
import DropdownIndicator from './DropdownIndicator'
import SelectContainer from './SelectContainer'
import Menu from './Menu'
import './styles.css'

export interface AutocompleteProps<T> {
  inputId?: string
  selected?: OptionType<T>
  selectOption?: (option: SingleValue<OptionType<T>>) => void
  loadOptions: LoadOptions<
    OptionType<T>,
    GroupBase<OptionType<T>>,
    { page: number }
  >
}

export default function Autocomplete<T>(props: AutocompleteProps<T>) {
  const [clearCache, setClearCache] = useState(false)

  const { selected, selectOption, loadOptions, inputId } = props
  const { t } = useTranslation()

  return (
    <AsyncPaginate
      inputId={inputId}
      className="select-container"
      classNamePrefix="select"
      value={selected}
      placeholder={t('AutocompletePlaceholder')}
      loadingMessage={() => true}
      noOptionsMessage={() => t('NoData')}
      onChange={(option) => selectOption && selectOption(option)}
      components={{ DropdownIndicator, Option, SelectContainer, Menu }}
      tabIndex={0}
      debounceTimeout={500}
      loadOptions={loadOptions}
      additional={{ page: 1 }}
      onMenuOpen={() => setClearCache(true)}
      onMenuClose={() => setClearCache(false)}
      cacheUniqs={[clearCache]}
    />
  )
}
