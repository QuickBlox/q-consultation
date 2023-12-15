import Modal from '../../components/Modal'
import ActivateSoundNotificationModal from '../modals/ActivateSoundNotificationModal'
import useComponent from './useComponent'

export default function Sound() {
  const {
    data: { isShowModal },
    handlers: { handleCloseModal },
  } = useComponent()

  return (
    <Modal>
      <ActivateSoundNotificationModal
        open={isShowModal}
        onClose={handleCloseModal}
      />
    </Modal>
  )
}
