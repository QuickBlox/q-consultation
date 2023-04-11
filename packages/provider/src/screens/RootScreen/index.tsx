import { Redirect, Route, Switch } from 'react-router-dom'
import cn from 'classnames'

import {
  APPOINTMENTS_ROUTE,
  PROFILE_ROUTE,
  HISTORY_ROUTE,
} from '../../constants/routes'

import Modal from '../../components/Modal'

import Header from '../../modules/Header'
import VideoCall from '../../modules/VideoCall'
import UploadIndicator from '../../modules/UploadIndicator'
import AppointmentActionModal from '../../modules/modals/AppointmentActionModal'
import AssignModal from '../../modules/modals/AssignModal'
import ConclusionModal from '../../modules/modals/ConclusionModal'
import FinishModal from '../../modules/modals/FinishModal'
import AppointmentDetailsModal from '../../modules/modals/AppointmentDetailsModal'
import Notifications from '../../modules/Notification'
import SkipModal from '../../modules/modals/SkipModal'
import LogoutModal from '../../modules/modals/LogoutModal'
import ShareLinkModal from '../../modules/modals/ShareLinkModal'
import CreateAppointmentModal from '../../modules/modals/CreateAppointmentModal'

import ProfileScreen from '../ProfileScreen'
import AppointmentsScreen from '../AppointmentsScreen'
import HistoryScreen from '../HistoryScreen'

import useComponent from './useComponent'
import './styles.css'
import EditNotesModal from '../../modules/modals/EditNotesModal'
import SaveRecordModal from '../../modules/modals/SaveRecordModal'

export default function MainScreen() {
  const {
    store: { onCall },
    data: { isOpenMenu, height, RESOLUTION_XS, appointmentsRouteMatch },
    handlers: { handleToggleMenu },
  } = useComponent()

  const renderContent = () => {
    return (
      <Switch>
        <Route exact path={PROFILE_ROUTE} component={ProfileScreen} />
        <Route exact path={HISTORY_ROUTE} component={HistoryScreen} />
        <Route
          exact
          path={APPOINTMENTS_ROUTE}
          render={() => (
            <AppointmentsScreen
              isOpenMenu={isOpenMenu}
              toggleMenu={handleToggleMenu}
            />
          )}
        />
        <Redirect to={APPOINTMENTS_ROUTE} />
      </Switch>
    )
  }

  return (
    <main
      className="main-screen-wrapper"
      style={appointmentsRouteMatch ? { height: `${height}px` } : undefined}
    >
      <UploadIndicator type="record" />
      <div className={cn('main-screen', { 'on-call': onCall })}>
        <div className="column">
          <Header toggleMenu={handleToggleMenu} />
          {renderContent()}
        </div>
        {!RESOLUTION_XS && <VideoCall />}
      </div>
      <div
        className={cn('backdrop', { active: isOpenMenu })}
        onClick={handleToggleMenu}
      />
      <Modal>
        <LogoutModal />
        <ShareLinkModal />
        <AppointmentActionModal />
        <AssignModal />
        <ConclusionModal />
        <EditNotesModal />
        <FinishModal />
        <Notifications />
        <SkipModal />
        <SaveRecordModal />
        <AppointmentDetailsModal />
        <CreateAppointmentModal />
      </Modal>
    </main>
  )
}
