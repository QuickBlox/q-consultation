import { useTranslation } from 'react-i18next'

import DropDownList from './DropDownList'
import { MoreSvg } from '../../icons'
import useComponent, { MoreMenuProps } from './useComponent'
import './styles.css'

export default function MoreMenu(props: MoreMenuProps) {
  const { disabled } = props
  const {
    refs: { menuRef },
    data: { menuListOpened, menuOptions },
    handlers: { openMenu, onMenuItemClick },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <button
      className="more-button"
      disabled={disabled}
      onClick={openMenu}
      type="button"
    >
      <MoreSvg className="icon" />
      <span>{t('More')}</span>
      <DropDownList
        active={menuListOpened}
        items={menuOptions}
        menuRef={menuRef}
        onSelect={onMenuItemClick}
      />
    </button>
  )
}
