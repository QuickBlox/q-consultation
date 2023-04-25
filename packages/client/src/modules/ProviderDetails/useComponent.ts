import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, generatePath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  createAppointmentWaitingByProviderIdSelector,
  createUsersByIdSelector,
  usersLoadingSelector,
} from '../../selectors'
import {
  listUsers,
  toggleShowModal,
  getAppointments,
} from '../../actionCreators'
import { createUseComponent, useActions } from '../../hooks'
import { APPOINTMENT_ROUTE } from '../../constants/routes'
import { parseUserCustomData } from '../../utils/user'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface ProviderDetailsProps {
  providerId?: QBUser['id']
  onBack: VoidFunction
  consultationTopic: string
}

const createSelector = (providerId?: QBUser['id']) =>
  createMapStateSelector({
    myAccountId: authMyAccountIdSelector,
    usersLoading: usersLoadingSelector,
    appointmentLoading: appointmentLoadingSelector,
    user: createUsersByIdSelector(providerId),
    appointment: createAppointmentWaitingByProviderIdSelector(providerId),
  })

export default createUseComponent((props: ProviderDetailsProps) => {
  const { providerId, consultationTopic } = props
  const selector = createSelector(providerId)
  const store = useSelector(selector)
  const actions = useActions({
    listUsers,
    toggleShowModal,
    getAppointments,
  })
  const { user, myAccountId, appointment, usersLoading, appointmentLoading } =
    store
  const loading = usersLoading || appointmentLoading
  const refBiography = useRef<HTMLPreElement>(null)

  const { t } = useTranslation()
  const history = useHistory()
  const isOffline = useIsOffLine()

  const dialogName =
    user?.full_name || user?.login || user?.phone || user?.email || t('Agent')
  const userData = parseUserCustomData(user?.custom_data)

  const handleWaitingRoomClick = () => {
    if (providerId) {
      if (appointment?._id) {
        const path = generatePath(APPOINTMENT_ROUTE, {
          appointmentId: appointment._id,
        })

        history.push(path)
      } else {
        actions.toggleShowModal({ modal: 'ConsultationTopicModal', providerId, consultationTopic })
      }
    }
  }

  const createHandleClickSeeMore = (userId?: QBUser['id']) => () => {
    actions.toggleShowModal({
      modal: 'ProviderBiographyModal',
      providerId: userId,
    })
  }

  useEffect(() => {
    if (providerId && !user && !usersLoading && !isOffline) {
      actions.listUsers({
        filter: {
          field: 'id',
          param: 'in',
          value: providerId,
        },
      })
    }
  }, [providerId, user, usersLoading, isOffline])

  useEffect(() => {
    if (providerId && !isOffline) {
      actions.getAppointments({
        client_id: myAccountId,
        provider_id: providerId,
        date_end: null,
        date_start: null,
      })
    }
  }, [providerId, isOffline])

  return {
    store,
    refs: { refBiography },
    data: { userData, dialogName, loading },
    handlers: {
      handleWaitingRoomClick,
      createHandleClickSeeMore,
    },
  }
})
