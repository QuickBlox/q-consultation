import { Switch, Route, Redirect } from 'react-router-dom'

import {
  PROFILE_ROUTE,
  APPOINTMENT_ROUTE,
  PROVIDERS_ROUTE,
  HISTORY_ROUTE,
} from '../../constants/routes'

import Modal from '../../components/Modal'

import Header from '../../modules/Header'
import Notifications from '../../modules/Notification'
import VideoCall from '../../modules/VideoCall'
import AppointmentDetailsModal from '../../modules/modals/AppointmentDetailsModal'
import LogoutModal from '../../modules/modals/LogoutModal'
import LeaveQueueModal from '../../modules/modals/LeaveQueueModal'
import CallModal from '../../modules/modals/CallModal'
import ConsultationTopicModal from '../../modules/modals/ConsultationTopicModal'
import ProviderBiographyModal from '../../modules/modals/ProviderBiographyModal'

import AppointmentScreen from '../AppointmentScreen'
import ProvidersScreen from '../ProvidersScreen'
import ProfileScreen from '../ProfileScreen'
import HistoryScreen from '../HistoryScreen'

import useComponent from './useComponent'
import './styles.css'

export default function RootScreen() {
  const {
    data: { location, height, appointmentRouteMatch },
  } = useComponent()

  const renderContent = () => {
    return (
      <Switch>
        <Route path={PROFILE_ROUTE} component={ProfileScreen} />
        <Route path={APPOINTMENT_ROUTE} component={AppointmentScreen} />
        <Route path={HISTORY_ROUTE} component={HistoryScreen} />
        <Route path={PROVIDERS_ROUTE} component={ProvidersScreen} />
        <Redirect to={location.state?.referrer || PROVIDERS_ROUTE} />
      </Switch>
    )
  }

  return (
    <main
      className="main-screen"
      style={appointmentRouteMatch ? { height: `${height}px` } : undefined}
    >
      <VideoCall />
      <div className="screen-wrapper">
        <Header />
        {renderContent()}
      </div>
      <Modal>
        <LeaveQueueModal />
        <CallModal />
        <ConsultationTopicModal />
        <AppointmentDetailsModal />
        <ProviderBiographyModal />
        <Notifications />
        <LogoutModal />
      </Modal>
    </main>
  )
}
