import { generatePath, Route, Routes, Navigate } from 'react-router-dom'
import cn from 'classnames'

import {
  APPOINTMENT_TYPE_ROUTE,
  PROFILE_ROUTE,
  HISTORY_ROUTE,
  SELECTED_APPOINTMENT_ROUTE,
} from '../../constants/routes'

import Modal from '../../components/Modal'

import Header from '../../modules/Header'
import VideoCall from '../../modules/VideoCall'
import AppointmentActionModal from '../../modules/modals/AppointmentActionModal'
import AssignModal from '../../modules/modals/AssignModal'
import ConclusionModal from '../../modules/modals/ConclusionModal'
import FinishModal from '../../modules/modals/FinishModal'
import AppointmentDetailsModal from '../../modules/modals/AppointmentDetailsModal'
import Notifications from '../../modules/Notification'
import SkipModal from '../../modules/modals/SkipModal'
import LogoutModal from '../../modules/modals/LogoutModal'
import ShareLinkModal from '../../modules/modals/ShareLinkModal'
import GuestUserModal from '../../modules/modals/GuestUserModal'
import RecordModal from '../../modules/modals/RecordModal'
import UploadRecordIndicator from '../../modules/UploadRecordIndicator'

import ProfileScreen from '../ProfileScreen'
import AppointmentsScreen from '../AppointmentsScreen'
import HistoryScreen from '../HistoryScreen'

import useComponent from './useComponent'
import './styles.css'
import EditNotesModal from '../../modules/modals/EditNotesModal'
import SaveRecordModal from '../../modules/modals/SaveRecordModal'
import { QUEUE_TYPE } from '../../constants/tabs'

export default function MainScreen() {
  const {
    store: { onCall },
    data: {
      isOpenMenu,
      height,
      RESOLUTION_XS,
      appointmentsRouteMatch,
      selectedAppointmentsRouteMatch,
    },
    handlers: { handleToggleMenu },
  } = useComponent()

  const renderContent = () => {
    return (
      <Routes>
        <Route path={PROFILE_ROUTE} element={<ProfileScreen />} />
        {HAS_HISTORY && (
          <Route path={HISTORY_ROUTE} element={<HistoryScreen />} />
        )}
        <Route
          path={SELECTED_APPOINTMENT_ROUTE}
          element={
            <AppointmentsScreen
              isOpenMenu={isOpenMenu}
              toggleMenu={handleToggleMenu}
            />
          }
        />
        <Route
          path={APPOINTMENT_TYPE_ROUTE}
          element={
            <AppointmentsScreen
              isOpenMenu={isOpenMenu}
              toggleMenu={handleToggleMenu}
            />
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={generatePath(APPOINTMENT_TYPE_ROUTE, {
                appointmentType: QUEUE_TYPE,
              })}
              replace
            />
          }
        />
      </Routes>
    )
  }

  return (
    <main
      className="main-screen-wrapper"
      style={
        appointmentsRouteMatch || selectedAppointmentsRouteMatch
          ? { height: `${height}px` }
          : undefined
      }
    >
      <UploadRecordIndicator />
      <div className={cn('main-screen', { 'on-call': onCall })}>
        <div className="column">
          <Header toggleMenu={handleToggleMenu} />
          {renderContent()}
        </div>
        {!RESOLUTION_XS && <VideoCall minimalistic={!appointmentsRouteMatch} />}
      </div>
      <div
        className={cn('backdrop', { active: isOpenMenu })}
        onClick={handleToggleMenu}
      />
      <Modal>
        {ENABLE_GUEST_CLIENT && <GuestUserModal />}
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
        <RecordModal />
      </Modal>
    </main>
  )
}
