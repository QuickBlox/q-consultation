import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { QBUser } from '@qc/quickblox'

import { selectProvider } from '../../actionCreators'
import { qbProviderIdSelector, usersFirstId } from '../../selectors'
import { createUseComponent, useActions, useMobileLayout } from '../../hooks'
import { ROOT_ROUTE } from '../../constants/routes'
import { createMapStateSelector } from '../../utils/selectors'

const selector = createMapStateSelector({
  selectedProviderId: qbProviderIdSelector,
  firstProviderId: usersFirstId,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({ selectProvider })
  const { selectedProviderId, firstProviderId } = store

  const navigate = useNavigate()
  const { providerId: defaultProviderId = '' } = useParams()
  const activeProviderId =
    +defaultProviderId || selectedProviderId || firstProviderId
  const RESOLUTION_XS = useMobileLayout()

  const handleChangeProvider = (id: QBUser['id']) => {
    actions.selectProvider(id)
  }

  const handleResetProvider = () => {
    actions.selectProvider(undefined)
    navigate(ROOT_ROUTE)
  }

  useEffect(
    () => () => {
      actions.selectProvider(undefined)
    },
    [],
  )

  return {
    store,
    actions,
    data: { activeProviderId, defaultProviderId, RESOLUTION_XS },
    handlers: {
      handleChangeProvider,
      handleResetProvider,
    },
  }
})
