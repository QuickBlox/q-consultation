import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { SearchSvg, UpdateSvg } from '../../icons'
import Avatar from '../../components/Avatar'
import Loader from '../../components/Loader'
import useComponent, { ProviderListProps } from './useComponent'
import './styles.css'
import { parseUserCustomData } from '../../utils/user'
import { TextAreaField } from '../../components/Field'
import Button from '../../components/Button'
import FormField from '../../components/FormField'

export default function ProviderList(props: ProviderListProps) {
  const { selected } = props
  const {
    forms: { searchForm },
    data: { search, isOffline, isShowAll },
    store: { loading, providers, suggestions },
    handlers: {
      handleChangeSearch,
      handleProviderSelectCreator,
      filterSearchedProviders,
      handleResetSearch,
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
    <div
      className={cn('provider-list', {
        'provider-list-wide': AI_SUGGEST_PROVIDER,
      })}
    >
      {AI_SUGGEST_PROVIDER ? (
        <form onSubmit={searchForm.handleSubmit}>
          <FormField
            htmlFor="search"
            label={t('FindYourAgent')}
            className="find-agent-field"
            hint={t('FindYourAgentHint')}
            error={searchForm.touched.search && searchForm.errors.search}
          >
            <TextAreaField
              id="search"
              name="search"
              placeholder={t('TypeYourIssueOrAgent')}
              disabled={loading}
              onChange={searchForm.handleChange}
              onBlur={searchForm.handleBlur}
              value={searchForm.values.search}
              rows={7}
            />
          </FormField>
          <div className="find-agent-controls">
            <Button type="submit" loading={loading}>
              {t('SearchAnAgent')}
            </Button>
            <button
              type="button"
              className="find-agent-reset"
              disabled={loading || isOffline}
              onClick={handleResetSearch}
            >
              {loading ? <Loader size={14} theme="primary" /> : <UpdateSvg />}
              <span>{t('RESET')}</span>
            </button>
          </div>
        </form>
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
        {AI_SUGGEST_PROVIDER && !isShowAll
          ? suggestions.map(renderProvider)
          : providers.filter(filterSearchedProviders).map(renderProvider)}
        {loading && (
          <li>
            <Loader theme="primary" />
          </li>
        )}
      </ul>
    </div>
  )
}
