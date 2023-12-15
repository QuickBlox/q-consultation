import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Loader from '../../components/Loader'
import useComponent from './useComponent'
import './styles.css'

export interface WaitingForNetworkProps {
  className?: string
}

export default function WaitingForNetwork({
  className,
}: WaitingForNetworkProps) {
  const {
    data: { isOffLine },
  } = useComponent()
  const { t } = useTranslation()

  if (!isOffLine) return null

  return (
    <div className={cn('waiting-network-container', className)}>
      <div className="waiting-network">
        <Loader theme="secondary" />
        <span className="waiting-network-text">
          {t('WaitingForConnection')}
        </span>
      </div>
    </div>
  )
}
