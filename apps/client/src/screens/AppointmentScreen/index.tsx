import Chat from '../../modules/Chat'
import Appointment from '../../modules/Appointment'
import Loader from '../../components/Loader'
import useComponent from './useComponent'
import Conclusion from '../../modules/Conclusion'
import './styles.css'

export default function AppointmentScreen() {
  const {
    data: { appointmentId, chatOpen },
    store: { loading, appointment },
    handlers: { setChatOpen },
  } = useComponent()

  if (loading && !appointment) {
    return (
      <div className="appointment-screen loading">
        <Loader theme="primary" size={22} />
      </div>
    )
  }

  if (appointment?.conclusion) {
    return (
      <div className="appointment-screen">
        <Conclusion appointmentId={appointmentId} />
      </div>
    )
  }

  return (
    <div className="appointment-screen">
      <Appointment
        onOpen={() => setChatOpen(true)}
        appointmentId={appointmentId}
      />
      <Chat
        opened={chatOpen}
        onClose={() => setChatOpen(false)}
        appointmentId={appointmentId}
      />
    </div>
  )
}
