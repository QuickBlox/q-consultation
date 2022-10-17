import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import cn from 'classnames'

import Dropdown from '../../components/Dropdown'
import MobileSidebar from '../../components/MobileSidebar'
import {
  LogoSvg,
  ShareSvg,
  MenuSvg,
  LanguageSvg,
  DropdownSvg,
  UserSvg,
  ClientsSvg,
} from '../../icons'

import { ROOT_ROUTE } from '../../constants/routes'
import localeOptions from '../../constants/localeOptions'
import useComponent from './useComponent'
import './styles.css'

export interface HeaderProps {
  toggleMenu?: VoidFunction
}

export default function Header(props: HeaderProps) {
  const { toggleMenu } = props
  const {
    store: { myAccount, onCall },
    data: {
      language,
      menuOptions,
      menuMobileOptions,
      menuSidebarOpen,
      isOffline,
    },
    handlers: {
      toggleMenuSidebarOpen,
      toggleLanguageModal,
      toggleShareLinkModal,
      handleSelectLanguage,
      selectedLanguageOption,
    },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <header className={cn('header', { 'header-auth': myAccount })}>
      <div className="header-nav header-nav-left">
        {myAccount && toggleMenu && (
          <button
            type="button"
            className="btn clients d-hidden"
            onClick={toggleMenu}
          >
            <ClientsSvg className="icon" />
          </button>
        )}
      </div>
      <div className="logo">
        <Link to={ROOT_ROUTE}>
          <LogoSvg className="icon" />
        </Link>
      </div>
      <div className={cn('header-nav', 'header-nav-right', { call: onCall })}>
        {myAccount && (
          <button
            type="button"
            className="share"
            onClick={toggleShareLinkModal}
            title={t('ShareLink')}
          >
            <ShareSvg className="icon" />
            <span className="text">{t('ShareLink')}</span>
          </button>
        )}
        {!myAccount && (
          <button
            type="button"
            className="btn lang d-hidden"
            onClick={toggleLanguageModal}
          >
            <LanguageSvg className="icon icon-lang" />
          </button>
        )}
        <Dropdown
          className="header-dropdown dropdown-lang m-hidden"
          value={language}
          onSelect={handleSelectLanguage}
          options={localeOptions}
          disabled={isOffline}
        >
          <LanguageSvg className="icon icon-lang" />
          <span className="dropdown-label">
            {selectedLanguageOption?.label}
          </span>
          <DropdownSvg className="icon icon-dropdown" />
        </Dropdown>
        {myAccount && (
          <>
            <button
              type="button"
              className="btn menu d-hidden"
              onClick={toggleMenuSidebarOpen}
            >
              <MenuSvg className="icon icon-user" />
            </button>
            <Dropdown
              className="header-dropdown dropdown-nav m-hidden"
              options={menuOptions}
            >
              <UserSvg className="icon icon-user" />
              <span className="dropdown-label">{myAccount.full_name}</span>
              <DropdownSvg className="icon icon-dropdown" />
            </Dropdown>
            <MobileSidebar
              position="right"
              open={menuSidebarOpen}
              onClose={toggleMenuSidebarOpen}
            >
              <ul className="header-menu">
                {menuMobileOptions.map((option, index) => (
                  <li
                    key={index}
                    className={cn('menu-item', {
                      'menu-item-divider': option.divider,
                    })}
                  >
                    {option.label &&
                      (option.path ? (
                        <Link
                          className="menu-item-text"
                          to={option.path}
                          onClick={toggleMenuSidebarOpen}
                        >
                          {option.label}
                        </Link>
                      ) : (
                        <span
                          className="menu-item-text"
                          onClick={() => {
                            toggleMenuSidebarOpen()

                            if (option.onClick) {
                              option.onClick()
                            }
                          }}
                        >
                          {option.label}
                        </span>
                      ))}
                  </li>
                ))}
              </ul>
            </MobileSidebar>
          </>
        )}
      </div>
    </header>
  )
}
