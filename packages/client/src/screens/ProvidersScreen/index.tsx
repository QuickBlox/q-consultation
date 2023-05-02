import cn from 'classnames'

import ProviderList from '../../modules/ProviderList'
import ProviderDetails from '../../modules/ProviderDetails'
import useComponent from './useComponent'
import './styles.css'

export default function ProvidersScreen() {
  const {
    data: { selectedProvider, defaultProviderId, consultationTopic },
    handlers: {
      handleChangeProvider,
      handleResetProvider,
      setConsultationTopic,
    },
  } = useComponent()

  return (
    <div className="providers-screen">
      {!defaultProviderId && (
        <ProviderList
          selected={selectedProvider}
          consultationTopic={consultationTopic}
          onSelect={handleChangeProvider}
          setConsultationTopic={setConsultationTopic}
        />
      )}
      <div
        className={cn('provider-info', {
          open: selectedProvider,
          'provider-info-wide': defaultProviderId,
        })}
      >
        <ProviderDetails
          consultationTopic={consultationTopic}
          providerId={selectedProvider}
          onBack={handleResetProvider}
        />
      </div>
    </div>
  )
}
