import cn from 'classnames'

import ProviderList from '../../modules/ProviderList'
import ProviderDetails from '../../modules/ProviderDetails'
import useComponent from './useComponent'
import './styles.css'

export default function ProvidersScreen() {
  const {
    store: { selectedProviderId },
    data: { activeProviderId, defaultProviderId },
    handlers: { handleChangeProvider, handleResetProvider },
  } = useComponent()

  return (
    <div className="providers-screen">
      {HAS_PROVIDER_LIST && !defaultProviderId && (
        <ProviderList
          selected={activeProviderId}
          onSelect={handleChangeProvider}
        />
      )}
      <div
        className={cn('provider-info', {
          open: !HAS_PROVIDER_LIST || selectedProviderId || defaultProviderId,
          'provider-info-wide': !HAS_PROVIDER_LIST || defaultProviderId,
        })}
      >
        <ProviderDetails
          providerId={activeProviderId}
          onBack={handleResetProvider}
        />
      </div>
    </div>
  )
}
