import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, generatePath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { QBUser } from '@qc/quickblox'

import {
  appointmentLoadingSelector,
  authMyAccountIdSelector,
  avatarEntriesSelector,
  createAppointmentWaitingByProviderIdSelector,
  createUsersByIdSelector,
  usersLoadingSelector,
} from '../../selectors'
import {
  listUsers,
  toggleShowModal,
  getAppointments,
  getUserAvatar,
} from '../../actionCreators'
import { createUseComponent, useActions } from '../../hooks'
import { APPOINTMENT_ROUTE } from '../../constants/routes'
import { parseUserCustomData } from '../../utils/user'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

export interface ProviderDetailsProps {
  providerId?: QBUser['id']
  onBack: VoidFunction
}

const createSelector = (providerId?: QBUser['id']) =>
  createMapStateSelector({
    myAccountId: authMyAccountIdSelector,
    user: createUsersByIdSelector(providerId),
    appointment: createAppointmentWaitingByProviderIdSelector(providerId),
    usersLoading: usersLoadingSelector,
    appointmentLoading: appointmentLoadingSelector,
    avatarEntries: avatarEntriesSelector,
  })

export default createUseComponent((props: ProviderDetailsProps) => {
  const { providerId } = props
  const selector = createSelector(providerId)
  const store = useSelector(selector)
  const actions = useActions({
    listUsers,
    toggleShowModal,
    getAppointments,
    getUserAvatar,
  })
  const {
    user,
    myAccountId,
    appointment,
    usersLoading,
    appointmentLoading,
    avatarEntries,
  } = store
  const loading = usersLoading || appointmentLoading
  const userAvatar = user?.id ? avatarEntries[user.id] : undefined
  const refBiography = useRef<HTMLPreElement>(null)

  const { t } = useTranslation()
  const navigate = useNavigate()
  const isOffline = useIsOffLine()

  const dialogName =
    user?.full_name || user?.login || user?.phone || user?.email || t('Unknown')
  const userData = parseUserCustomData(user?.custom_data)

  const handleWaitingRoomClick = () => {
    if (providerId) {
      if (appointment?._id) {
        const path = generatePath(APPOINTMENT_ROUTE, {
          appointmentId: appointment._id,
        })

        navigate(path)
      } else {
        actions.toggleShowModal({ modal: 'ConsultationTopicModal', providerId })
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
      })
    }
  }, [providerId, isOffline])

  useEffect(() => {
    if (providerId && !avatarEntries[providerId]) {
      actions.getUserAvatar(providerId)
    }
  }, [providerId])

  return {
    store,
    refs: { refBiography },
    data: { userData, dialogName, loading, userAvatar },
    handlers: {
      handleWaitingRoomClick,
      createHandleClickSeeMore,
    },
  }
})
