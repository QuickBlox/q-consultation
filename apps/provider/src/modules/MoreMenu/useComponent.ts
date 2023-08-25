import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Option } from './DropDownList'
import { toggleShowModal } from '../../actionCreators'
import { createUseComponent, useActions } from '../../hooks'

const isNode = (t: EventTarget): t is Node => {
  return t && t instanceof Node
}

export interface MoreMenuProps {
  disabled?: boolean
  appointmentId?: QBAppointment['_id']
}

export default createUseComponent((props: MoreMenuProps) => {
  const { appointmentId } = props
  const actions = useActions({ toggleShowModal })

  const { t } = useTranslation()
  const [menuListOpened, setMenuListOpened] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const menuOptions: Array<Option<string, 'finish' | 'assign' | 'skip'>> = [
    {
      label: t('FinishConsultation'),
      value: 'finish',
    },
    {
      label: '',
      className: 'divider',
    },
    {
      label: `${t('AssignTo')}...`,
      value: 'assign',
    },
    {
      label: t('RemoveFromQueue'),
      value: 'skip',
    },
  ]

  const clickHandler: EventListener = (e) => {
    if (
      e.target &&
      isNode(e.target) &&
      menuRef.current &&
      (menuRef.current.contains(e.target) || menuListOpened)
    ) {
      setMenuListOpened(!menuListOpened)
    }
  }

  const openMenu = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (
      isNode(e.target) &&
      e.currentTarget.contains(e.target) &&
      !menuListOpened
    ) {
      setMenuListOpened(true)
    }
  }

  const onMenuItemClick = (
    item: Option<string, 'finish' | 'assign' | 'skip'>,
  ) => {
    switch (item.value) {
      case 'assign':
        actions.toggleShowModal({ modal: 'AssignModal', appointmentId })
        break
      case 'finish':
        actions.toggleShowModal({ modal: 'FinishModal', appointmentId })
        break
      case 'skip':
        actions.toggleShowModal({ modal: 'SkipModal', appointmentId })
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (menuListOpened) {
      document.addEventListener('click', clickHandler)
    }

    return () => document.removeEventListener('click', clickHandler)
  }, [menuListOpened])

  return {
    refs: { menuRef },
    data: {
      menuListOpened,
      menuOptions,
    },
    handlers: {
      openMenu,
      onMenuItemClick,
    },
  }
})
