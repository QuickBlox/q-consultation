import { Navigate, generatePath } from 'react-router-dom'

import Appointments from '../../modules/Appointments'
import Chat from '../../modules/Chat'
import useComponent, { AppointmentsScreenProps } from './useComponent'
import './styles.css'
import {
  APPOINTMENT_TYPE_ROUTE,
  SELECTED_APPOINTMENT_ROUTE,
} from '../../constants/routes'
import {
  ABOUT_TAB,
  CALL_TAB,
  CHAT_TAB,
  HISTORY_TAB,
  QUEUE_TYPE,
} from '../../constants/tabs'

export default function AppointmentsScreen(props: AppointmentsScreenProps) {
  const { isOpenMenu, toggleMenu } = props
  const {
    data: { appointmentId, appointmentType, tab },
    handlers: { selectAppointmentId },
  } = useComponent()

  if (appointmentType && appointmentType !== QUEUE_TYPE) {
    return (
      <Navigate
        to={generatePath(APPOINTMENT_TYPE_ROUTE, {
          appointmentType: QUEUE_TYPE,
        })}
        replace
      />
    )
  }

  if (
    appointmentType &&
    tab &&
    appointmentId &&
    ![ABOUT_TAB, CHAT_TAB, HISTORY_TAB, CALL_TAB].includes(tab)
  ) {
    return (
      <Navigate
        to={generatePath(SELECTED_APPOINTMENT_ROUTE, {
          appointmentType,
          appointmentId,
          tab: ABOUT_TAB,
        })}
        replace
      />
    )
  }

  return (
    <div className="appointments-screen">
      <Appointments
        isOpenMenu={isOpenMenu}
        toggleMenu={toggleMenu}
        selected={appointmentId}
        onSelect={selectAppointmentId}
      />
      <Chat appointmentId={appointmentId} />
    </div>
  )
}
