import Appointments from '../../modules/Appointments'
import Chat from '../../modules/Chat'
import useComponent, { AppointmentsScreenProps } from './useComponent'
import './styles.css'

export default function AppointmentsScreen(props: AppointmentsScreenProps) {
  const { isOpenMenu, toggleMenu } = props
  const {
    data: { appointmentId },
    handlers: { selectAppointmentId },
  } = useComponent()

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
