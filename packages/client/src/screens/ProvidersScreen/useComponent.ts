import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import { getAppointments, selectProvider } from '../../actionCreators'
import { qbProviderIdSelector } from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { ROOT_ROUTE } from '../../constants/routes'
import { createMapStateSelector } from '../../utils/selectors'

const selector = createMapStateSelector({
  providerId: qbProviderIdSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({ getAppointments, selectProvider })
  const [consultationTopic, setConsultationTopic] = useState('')

  const { providerId } = store

  const history = useHistory()
  const { providerId: defaultProviderId } = useParams<Dictionary<string>>()
  const selectedProvider = defaultProviderId ? +defaultProviderId : providerId

  const handleChangeProvider = (id: QBUser['id']) => {
    actions.selectProvider(id)
  }

  const handleResetProvider = () => {
    actions.selectProvider(undefined)
    history.push(ROOT_ROUTE)
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
    data: { selectedProvider, defaultProviderId, consultationTopic },
    handlers: {
      handleChangeProvider,
      handleResetProvider,
      setConsultationTopic,
    },
  }
})
