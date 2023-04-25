import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { SearchSvg } from '../../icons'
import Avatar from '../../components/Avatar'
import Loader from '../../components/Loader'
import useComponent, { ProviderListProps } from './useComponent'
import './styles.css'
import { parseUserCustomData } from '../../utils/user'
import { TextAreaField } from '../../components/Field'
import Button from '../../components/Button'

export default function ProviderList(props: ProviderListProps) {
  const { selected, consultationTopic } = props
  const {
    store: { loading, providers, suggestions },
    data: { search },
    handlers: {
      handleChangeSearch,
      handleProviderSelectCreator,
      filterSearchedProviders,
      handleChangeConsultationTopic,
      handleSearch,
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
    <div className={cn('provider-list', { 'provider-list-wide': AI_SUGGEST_PROVIDER })}>
      {AI_SUGGEST_PROVIDER ? (
        <>
          <div className="header-block">
            <span className="title">{t('ConsultationTopic')}</span>
          </div>
          <div>
            <TextAreaField
              disabled={loading}
              className="consultation-topic-field"
              onChange={handleChangeConsultationTopic}
              value={consultationTopic}
              rows={7}
            />
            <Button
              loading={loading}
              disabled={!consultationTopic.length}
              onClick={handleSearch}
            >
              {t('SearchAnAgent')}
            </Button>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
      <ul className="providers">
        {suggestions.length
          ? suggestions.map(renderProvider)
          : providers.filter(filterSearchedProviders).map(renderProvider)
        }
        {loading && (
          <li>
            <Loader theme="primary" />
          </li>
        )}
      </ul>
    </div>
  )
}
