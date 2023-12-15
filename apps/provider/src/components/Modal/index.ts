import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

const modalRoot = document.getElementById('modal-root')

interface ModalProps {
  children?: ReactNode
}

export default function Modal({ children }: ModalProps) {
  return modalRoot && ReactDOM.createPortal(children, modalRoot)
}
