import { useSelector } from 'react-redux'

import { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getUser } from '../../actionCreators'
import {
  usersListSelector,
  usersLoadingSelector,
  usersTotalEntriesSelector,
} from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface ProviderListProps {
  selected?: QBUser['id']
  onSelect: (providerId: QBUser['id']) => void
}

const PER_PAGE = 30

const selector = createMapStateSelector({
  providers: usersListSelector,
  loading: usersLoadingSelector,
  totalEntries: usersTotalEntriesSelector,
})

export default createUseComponent((props: ProviderListProps) => {
  const { onSelect } = props
  const store = useSelector(selector)
  const actions = useActions({ getUser })
  const isOffline = useIsOffLine()
  const { loading, providers, totalEntries } = store
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const handleChangeSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => setSearch(value)

  const handleProviderSelectCreator = (id: QBUser['id']) => () => {
    onSelect(id)
  }

  const filterSearchedProviders = (user: QBUser) => {
    const dialogName =
      user.full_name || user.login || user.phone || user.email || t('Unknown')

    return dialogName.toLocaleLowerCase()?.includes(search.toLocaleLowerCase())
  }

  useEffect(() => {
    if (!isOffline) {
      actions.getUser({
        tags: PROVIDER_TAG,
        per_page: PER_PAGE,
        page: 1,
      })
    }
  }, [isOffline])

  useEffect(() => {
    if (!loading && providers.length < totalEntries && !isOffline) {
      actions.getUser({
        tags: PROVIDER_TAG,
        per_page: PER_PAGE,
        page: Math.floor(providers.length / PER_PAGE) + 1,
      })
    }
  }, [loading, providers.length, providers, isOffline])

  return {
    store,
    data: { search, isOffline },
    handlers: {
      handleChangeSearch,
      handleProviderSelectCreator,
      filterSearchedProviders,
    },
  }
})
