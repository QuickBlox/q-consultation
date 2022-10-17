import cn from 'classnames'

import ProviderList from '../../modules/ProviderList'
import ProviderDetails from '../../modules/ProviderDetails'
import useComponent from './useComponent'
import './styles.css'

export default function ProvidersScreen() {
  const {
    data: { selectedProvider, defaultProviderId },
    handlers: { handleChangeProvider, handleResetProvider },
  } = useComponent()

  return (
    <div className="providers-screen">
      {!defaultProviderId && (
        <ProviderList
          selected={selectedProvider}
          onSelect={handleChangeProvider}
        />
      )}
      <div
        className={cn('provider-info', {
          open: selectedProvider,
          'provider-info-wide': defaultProviderId,
        })}
      >
        <ProviderDetails
          providerId={selectedProvider}
          onBack={handleResetProvider}
        />
      </div>
    </div>
  )
}
