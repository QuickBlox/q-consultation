import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { SearchSvg } from '../../icons'
import Avatar from '../../components/Avatar'
import Loader from '../../components/Loader'
import useComponent, { ProviderListProps } from './useComponent'
import './styles.css'
import { parseUserCustomData } from '../../utils/user'

export default function ProviderList(props: ProviderListProps) {
  const { selected } = props
  const {
    store: { loading, providers },
    data: { search },
    handlers: {
      handleChangeSearch,
      handleProviderSelectCreator,
      filterSearchedProviders,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderProvider = (user: QBUser) => {
    const dialogName =
      user.full_name || user.login || user.phone || user.email || t('Unknown')
    const userData = parseUserCustomData(user?.custom_data)

    return (
      <li
        key={user.id}
        className={cn('provider-item', { active: user.id === selected })}
        onClick={handleProviderSelectCreator(user.id)}
      >
        <Avatar
          url={
            userData.avatar?.uid && QB.content.privateUrl(userData.avatar.uid)
          }
        />
        <span className="provider-name">{dialogName}</span>
      </li>
    )
  }

  return (
    <div className="provider-list">
      <div className="header-block">
        <span className="title">{t('SelectAnAgent')}</span>
      </div>
      <div className="provider-search">
        <SearchSvg className="icon" />
        <input
          onChange={handleChangeSearch}
          placeholder={t('Search')}
          type="search"
          value={search}
        />
      </div>
      <ul className="providers">
        {providers.filter(filterSearchedProviders).map(renderProvider)}
        {loading && (
          <li>
            <Loader theme="primary" />
          </li>
        )}
      </ul>
    </div>
  )
}
